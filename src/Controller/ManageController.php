<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Ingredient;
use App\Entity\Allergy;

class ManageController extends AbstractController
{
    /**
     * @Route("/addIngredient", name="addIngredient")
     */
    public function addIngredient()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        $correcto = false;
        $redundante = false;

        $repositoryIngredients = $this->getDoctrine()->getRepository(Ingredient::class);
        $all_ingredients = $repositoryIngredients->findAll();
        if ($user->getRoles()[0] != "ROLE_ADMIN") {
            $userId = $user->getId();
        }

        foreach ($all_ingredients as $ingredient) {
            if ($ingredient->getName() == $_POST['nameIngredient']) {
                $redundante = true;
            }
        }
        if (!$redundante) {
            if(isset($_POST['nameIngredient']) && isset($_POST['categoryIngredient'])) {


                    $ingredient = new Ingredient();
                    $ingredient->setName($_POST['nameIngredient']);
                    $ingredient->setCategory($_POST['categoryIngredient']);
                    if (isset($userId)) {
                        $ingredient->setIdUser($userId);
                    }
                    $manager = $this->getDoctrine()->getManager();
                    $manager->merge($ingredient);
                    $manager->flush();
                    $correcto = true;
                if ($user->getRoles()[0] != "ROLE_ADMIN") {
                    $msgInfo = "Se ha añadido el alimento correctamente. Por favor refresque la página para que le aparezca el nuevo alimento añadido.";
                } else {
                    $msgInfo = "Se ha añadido el alimento correctamente.";
                }
                    $result = [
                        "correcto" => $correcto,
                        "info" => $msgInfo
                    ];

                } else {
                    $msgInfo = "Vaya algo a salido mal al agregar el alimento.";
                    $result = [
                        "correcto" => $correcto,
                        "info" => $msgInfo
                    ];
                }
        } else {
            $msgInfo = "Ya existe un alimento con el mismo nombre.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];
        }

        return new JsonResponse($result);

    }

    /**
     * @Route("/addAllergy", name="addAllergy")
     */
    public function addAllergy()
    {

        $repositoryIngredients = $this->getDoctrine()->getRepository(Ingredient::class);
        $correcto = false;
        if(isset($_POST['allergyName']) && ($_POST['allergyName'] != "" || $_POST['allergyName'] != " ")) {
            $allergy = new Allergy();
            $allergy->setName($_POST['allergyName']);
            $allergy->setType($_POST['allergyType']);
            if(!empty($_POST['allergyIngredients'])) {
                foreach($_POST['allergyIngredients'] as $aIngredient) {
                    $ingredient =  $repositoryIngredients->findOneById($aIngredient);
                    $allergy->addIngredientCollection($ingredient);
                }
                $manager = $this->getDoctrine()->getManager();
                $manager->persist($allergy);
                $manager->flush();

                $correcto = true;

                $msgInfo = "Se ha añadido la alergia correctamente.";
                $result = [
                    "correcto" => $correcto,
                    "info" => $msgInfo
                ];

            } else {

                $msgInfo = "No se encontraron ingredientes para añadir a su alergia.";
                $result = [
                    "correcto" => $correcto,
                    "info" => $msgInfo
                ];
            }

        } else {

            $msgInfo = "Vaya algo salio mal y no se encontraron las variables para añadir la nueva alergia.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];

        }

        return new JsonResponse($result);

    }

}