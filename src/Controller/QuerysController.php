<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class QuerysController extends AbstractController
{
    /**
     * @Route("/getDepartaments", name="getDepartaments")
     */
    public function getDepartaments() {
        $response = [];
        if(isset($_POST['country'])) {
            if($_POST['country'] == "España") {
                $em = $this->getDoctrine()->getManager();
                $conn = $em ->getConnection();
                $sql = "SELECT * FROM provincias";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $stmt-> fetchAll();
                $response = 'correcto' -> true;
                $response = 'respuesta' -> $stmt;
            } else {
                $response = 'correcto' -> false;
                $response = 'respuesta' -> $stmt = 'msg' -> "El valor recibido, No es de un pais incluido actualmente";
            }
        } else {
            $response = 'correcto' -> false;
            $response = 'respuesta' -> $stmt = 'msg' -> "No se paso ningún pais.";
        }
        echo json_encode($response);
    }
}
