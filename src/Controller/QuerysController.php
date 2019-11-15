<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

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


}