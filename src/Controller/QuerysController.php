<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class QuerysController extends AbstractController
{
    /**
     * @Route("/departaments", name="departaments")
     */
    public function getDepartaments()
    {
        if(isset($_POST['country'])) {
            if($_POST['country'] == "España") {
                $conn = $this->getEntityManager()->getConnection();
                $sql = "SELECT * FROM provincias";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $stmt-> get_result();
            } else {
                $stmt = "El valor recibido, No es de un pais incluido actualmente";
            }
        } else {
            $stmt = "No se paso ningún pais.";
        }
        echo json_encode($stmt);
    }
}
