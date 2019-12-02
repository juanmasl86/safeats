<?php

namespace App\Controller;

use App\Entity\Ingredient;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        if($user == 'anon.') { //Filtro para los usuarios logueados

            return $this->redirectToRoute('app_login');

        } else {

            if(is_null($user->getUsercity())) {

                return $this->render('default/personaldata.html.twig', [
                    'user' => $user
                ]);

            } else {

                return $this->render('default/allergy.html.twig', [
                    'user' => $user,
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


                return $this->render('default/administration.html.twig', [
                    'user' => $user
                ]);


    }

    /**
     * @Route("/updateUser", name="updateUser")
     */
    public function updateUser()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        if(isset($_POST)){

            $user->setName($_POST['name']);
            $user->setUserlastname($_POST['lastname']);
            $user->setAddress($_POST['address']);
            $user->setPostalCode($_POST['postal_code']);
            $user->setCountry($_POST['country']);
            $user->setDepartament($_POST['departament']);
            $user->setUsercity($_POST['city']);
            $user->setRoles(["ROLE_USER"]);
            $manager = $this->getDoctrine()->getManager();
            $manager->merge($user);
            $manager->flush();

            $script = "<script>location.href = './';</script>";
            return new JsonResponse($script);

        } else {
            $script = "error al actualizar al usuario.";
            return new JsonResponse($script);
        }

    }


}
