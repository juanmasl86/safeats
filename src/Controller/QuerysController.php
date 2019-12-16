<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\Issue;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Ingredient;
use App\Entity\Category;
use App\Entity\Plate;
use App\Entity\User;
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

    /**
     * @Route("/getPlatesCategories", name="getPlatesCategories")
     */
    public function getPlatesCategories()
    {
        if(isset($_POST['company'])) {

                $em =$this->getDoctrine()->getEntityManager();
                $con = $em->getConnection();
                $sql = 'SELECT * FROM category WHERE id_company = ' .$_POST['company'];
                $stmt = $con->prepare($sql);
                $stmt->execute();


                $sql2 = 'SELECT * FROM plate WHERE category_id IS NULL AND id_company = ' .$_POST['company'];
                $stmt2 = $con->prepare($sql2);
                $stmt2->execute();

                $result = [
                    "categories" => $stmt->fetchAll(),
                    "plates" => $stmt2->fetchAll()
                ];

                return new JsonResponse($result);

        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }

    }

    /**
     * @Route("/getCompanies", name="getCompanies")
     */
    public function getCompanies()
    {

        if(isset($_POST['city'])) {
            $em =$this->getDoctrine()->getEntityManager();
            $con = $em->getConnection();
            $sql = "SELECT * FROM company WHERE company_city = '".$_POST['city']."'";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $companybycity = $stmt->fetchAll();

            if ($companybycity) {
            return new JsonResponse($companybycity);
            } else {
                $em =$this->getDoctrine()->getEntityManager();
                $con = $em->getConnection();
                $sql = "SELECT * FROM company WHERE company_departament = '".$_POST['departament']."'";
                $stmt2 = $con->prepare($sql);
                $stmt2->execute();
                $companybydepartament = $stmt->fetchAll();
                return new JsonResponse($companybydepartament);
            }

        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @Route("/getMenu", name="getMenu")
     */
    public function getMenu()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        if(isset($_POST['id'])) {
            $repositoryCompanies = $this->getDoctrine()->getRepository(Company::class);
            $company = $repositoryCompanies->findOneById($_POST['id']);

            $ingredientsAllergy =[];
            foreach($user->getAllergyCollection() AS $allergy){
                foreach ($allergy->getIngredientCollection() AS $ingrediente2){
                    array_push($ingredientsAllergy,$ingrediente2->getName());
                }
            }


                $infoCategory = [];
                    $infoPlate =[];

            foreach ($company->getCategoryCollection() AS $category) {

                foreach ($category->getPlateCollection() AS $plate) {
                        $exist = false;
                        $badIngredient = [];
                    foreach ($plate->getIngredientCollection() AS $ingredient) {
                        foreach ($ingredientsAllergy AS $compare) {
                            if ($compare == $ingredient->getName()) {
                                $exist = true;
                                array_push($badIngredient, $compare);
                            }

                        }
                    }
                    if($exist) {
                        $plateAllergy = [
                            "namePlate" => $plate->getName(),
                            "pricePlate" =>  $plate->getPrice(),
                            "found" => $badIngredient
                        ];

                        array_push($infoPlate, $plateAllergy);
                    } else {
                        $plateAllergy = [
                            "namePlate" => $plate->getName(),
                            "pricePlate" =>  $plate->getPrice(),
                        ];
                        array_push($infoPlate, $plateAllergy);
                    }
                }
                $plateCategory = [
                    "nameCategory" => $category->getName(),
                    "plates" =>  $infoPlate,
                ];
                array_push($infoCategory, $plateCategory);
            }


            return new JsonResponse($infoCategory);

        } else {
            return new JsonResponse('no results found', Response::HTTP_NOT_FOUND);
        }
    }

}