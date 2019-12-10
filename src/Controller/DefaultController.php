<?php

namespace App\Controller;

use App\Entity\Ingredient;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Allergy;
use App\Entity\User;

class DefaultController extends AbstractController
{
    /**
 * @Route("/", name="index")
 */
    public function index()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        if($user == 'anon.') { //Filtro para los usuarios logueados

            return $this->redirectToRoute('app_login');

        } else {

            if(is_null($user->getUsercity())) {

                return $this->render('default/personaldata.html.twig', [
                    'user' => $user
                ]);

            } else {

                return $this->render('default/index.html.twig', [
                    'user' => $user,
                ]);

            }

        }
    }

    /**
     * @Route("/list_allergys", name="list_allergys")
     */
    public function allergysView()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        $repositoryAllergy = $this->getDoctrine()->getRepository(Allergy::class);
        $allAllergys = $repositoryAllergy->findByType("comun");

        if($user == 'anon.') { //Filtro para los usuarios logueados

            return $this->redirectToRoute('app_login');

        } else {

            if(is_null($user->getUsercity())) {

                return $this->render('default/personaldata.html.twig', [
                    'user' => $user
                ]);

            } else {
                $repositoryIngredients = $this->getDoctrine()->getRepository(Ingredient::class);
                $all_ingredients = $repositoryIngredients->findAll();

                $em =$this->getDoctrine()->getEntityManager();
                $con = $em->getConnection();
                $sql = 'SELECT DISTINCT category 
                    FROM ingredient 
                    ORDER BY category ASC';
                $stmt = $con->prepare($sql);
                $stmt->execute();

               $categorys =[];

               foreach ($stmt->fetchAll() AS $category) {
                   array_push($categorys, $category["category"]);
                }

                return $this->render('default/allergy.html.twig', [
                    "user" => $user, "all_category" => $categorys, "all_ingredients" => $all_ingredients, "allAllergys" => $allAllergys
                ]);

            }

        }
    }

    /**
     * @Route("/administracion", name="administracion")
     */
    public function adminView()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

            if($user->getRoles()[0] == "ROLE_ADMIN") {
                return $this->render('default/administration.html.twig', [
                    'user' => $user
                ]);
            } else {

                if(is_null($user->getUsercity())) {

                    return $this->render('default/personaldata.html.twig', [
                        'user' => $user, 'ERROR' => "ACCESO DENEGADO NO TIENES PERMISO DE ADMINISTRADOR"
                    ]);

                } else {

                    return $this->render('default/index.html.twig', [
                        'user' => $user, 'ERROR' => "ACCESO DENEGADO NO TIENES PERMISO DE ADMINISTRADOR"
                    ]);

                }
            }

//                return $this->render('default/administration.html.twig', [
//                    'user' => $user
//                ]);


    }

    /**
 * @Route("/empresas", name="empresas")
 */
    public function empresasView()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        $repositoryIngredients = $this->getDoctrine()->getRepository(Ingredient::class);
        $all_ingredients = $repositoryIngredients->findAll();

        $em =$this->getDoctrine()->getEntityManager();
        $con = $em->getConnection();
        $sql = 'SELECT DISTINCT category 
                    FROM ingredient 
                    ORDER BY category ASC';
        $stmt = $con->prepare($sql);
        $stmt->execute();

        $categorys =[];

        foreach ($stmt->fetchAll() AS $category) {
            array_push($categorys, $category["category"]);
        }

        return $this->render('default/empresas.html.twig', [
            'user' => $user , "all_category" => $categorys, "all_ingredients" => $all_ingredients
        ]);


    }

    /**
     * @Route("/contacto", name="contacto")
*/
    public function contactoView()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        return $this->render('default/contacto.html.twig', [
            'user' => $user
        ]);


    }

}
