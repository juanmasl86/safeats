<?php

namespace App\Controller;

use App\Entity\Issue;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Ingredient;
class QuerysController extends AbstractController
{
    /**
     * @Route("/getDepartaments", name="getDepartaments")
     */
    public function getDepartaments() 
    {
        if(isset($_POST['country'])) {
            if($_POST['country'] == "España") {
            $em =$this->getDoctrine()->getEntityManager();
            $con = $em->getConnection();
            $sql = 'SELECT * FROM provincias';
            $stmt = $con->prepare($sql);
            $stmt->execute();

            return new JsonResponse($stmt->fetchAll());
            }
        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }
        
    }

    /**
     * @Route("/getCities", name="getCities")
     */
        public function getCities()
        {
            if(isset($_POST['departamentId'])) {

                $em =$this->getDoctrine()->getEntityManager();
                $con = $em->getConnection();
                $sql = 'SELECT * FROM municipios WHERE provincia = ' . $_POST['departamentId'] . ' ORDER BY id';
                $stmt = $con->prepare($sql);
                $stmt->execute();

                return new JsonResponse($stmt->fetchAll());

            } else {
                return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
            }

        }

    /**
     * @Route("/getIngredients", name="getIngredients")
     */
    public function getIngredients()
    {
        $arrayIngredients = [];
        $ingredients =[];
        $repositoryIngredients = $this->getDoctrine()->getRepository(Ingredient::class);
        $all_ingredients = $repositoryIngredients->findAll();
        $size = count($all_ingredients);
        if($size != 0 ) {
            foreach ($all_ingredients as $ingredient) {
                $ingredientArray = [
                    "id" => $ingredient->getId(),
                    "name" => $ingredient->getName(),
                    "category" => $ingredient->getCategory(),
                    "idUser" => $ingredient->getIdUser(),
                ];

                array_push($ingredients, $ingredientArray);
            }
            array_push($arrayIngredients, $ingredients);

            $em =$this->getDoctrine()->getEntityManager();
            $con = $em->getConnection();
            $sql = 'SELECT DISTINCT category 
                    FROM ingredient 
                    ORDER BY category ASC';
            $stmt = $con->prepare($sql);
            $stmt->execute();

            array_push($arrayIngredients, $stmt->fetchAll());

            return new JsonResponse($arrayIngredients);

        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }

    }

    /**
     * @Route("/getIssues", name="getIssues")
     */
    public function getIssues()
    {
        $arrayIssues = [];
        $repositoryIssues = $this->getDoctrine()->getRepository(Issue::class);
        $all_issues = $repositoryIssues->findAll();
        $size = count($all_issues);
        if ($size != 0) {
            foreach ($all_issues as $issue) {
                $IssueArray = [
                    "id" => $issue->getId(),
                    "emailSender" => $issue->getEmail(),
                    "title" => $issue->getTitle(),
                    "category" => $issue->getCategory(),
                    "timecreated" => $issue->getTimecreated(),
                    "body" => $issue->getBodyIssue(),
                    "read" => $issue->getReadIssue(),
                    "answered" => $issue->getAnswered()
                ];

                array_push($arrayIssues, $IssueArray);
            }

            return new JsonResponse($arrayIssues);

        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }
    }

}