<?php

namespace App\Controller;

use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
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

            if(empty($user->getUsercity())) {

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
     * @Route("/updateUser", name="updateUser")
     */
    public function updateUser()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();
    }
}
