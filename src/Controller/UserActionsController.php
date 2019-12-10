<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Ingredient;
use App\Entity\Allergy;
use App\Entity\Issue;
use App\Entity\Company;

class UserActionsController extends AbstractController {
    /**
     * @Route("/addIssue", name="addIssue")
     */
    public function addIssue()
    {
        $correcto = false;
        $time = time();

        if($_POST['issueReport']) {
                $issue = new Issue();
                $issue->setEmail($_POST['email']);
                $issue->setCategory($_POST['category']);
                $issue->setBodyIssue($_POST['issueReport']);
                $issue->setTitle($_POST['title']);
                $issue->setTimecreated($time);
                $issue->setReadIssue(false);
                $issue->setAnswered(false);
                $manager = $this->getDoctrine()->getManager();
                $manager->merge($issue);
                $manager->flush();

                $correcto = true;
                $msgInfo = "La incidencia se a registrado correctamente.";
                $result = [
                    "correcto" => $correcto,
                    "info" => $msgInfo
                ];

            } else {
                $msgInfo = "Vaya algo a salido mal al enviar la incidencia.";
                $result = [
                    "correcto" => $correcto,
                    "info" => $msgInfo
                ];
            }


        return new JsonResponse($result);

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

    /**
     * @Route("/editUser", name="editUser")
     */
    public function editUser()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();
        $correcto = false;

        if(isset($_POST)){
            if(isset($_POST["permisos"]) && $_POST["permisos"] == "ACTIVAR") {
                $user->setRoles(["ROLE_SUPER_USER"]);
            }

            if(isset($_POST["name"]) && $_POST["name"] != "") {
                $user->setName($_POST["name"]);
            }

            if(isset($_POST["lastName"]) && $_POST["lastName"] != "") {
                $user->setUserlastname($_POST["lastName"]);
            }

            if(isset($_POST["address"]) && $_POST["address"] != "") {
                $user->setAddress($_POST["address"]);
            }

            if(isset($_POST["postalCode"]) && $_POST["postalCode"] != "") {
                $user->setPostalCode($_POST["address"]);
            }

            if(isset($_POST["country"]) && $_POST["country"] != "") {
                $user->setCountry($_POST['country']);
                $user->setDepartament($_POST['departament']);
                $user->setUsercity($_POST['city']);
            }

            $manager = $this->getDoctrine()->getManager();
            $manager->merge($user);
            $manager->flush();

            $correcto = true;
            $msgInfo = "Se ha actualizado su usuario correctamente correctamente. Si ha cambiado los permisos de su cuenta se harán efectivos al iniciar sessión.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];

        } else {
            $msgInfo = "Vaya algo a salido mal al actualizar su usuario.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];
        }


        return new JsonResponse($result);

    }

    /**
     * @Route("/addAllergyPersonal", name="addAllergyPersonal")
     */
    public function addAllergyPersonal()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();
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

                $user->addAllergyCollection($allergy);
                $manager = $this->getDoctrine()->getManager();
                $manager->merge($user);
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

    /**
     * @Route("/addAllergyComun", name="addAllergyComun")
     */
    public function addAllergyComun()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();
        $repositoryAllergy = $this->getDoctrine()->getRepository(Allergy::class);
        $correcto = false;
        if(isset($_POST['allergyArray'])) {

            if(!empty($_POST['allergyArray'])) {
                foreach($_POST['allergyArray'] as $idAllergy) {
                    $allergy =  $repositoryAllergy->findOneById($idAllergy);
                    $user->addAllergyCollection($allergy);
                }
                $manager = $this->getDoctrine()->getManager();
                $manager->merge($user);
                $manager->flush();

                $correcto = true;

                $msgInfo = "Se ha añadido la alergia correctamente.";
                $result = [
                    "correcto" => $correcto,
                    "info" => $msgInfo
                ];

            } else {

                $msgInfo = "No se encontrar ninguna alergia con el id seleccionado.";
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

    /**
     * @Route("/registrationCompany", name="registrationCompany")
     */
    public function registrationCompany()
    {
        $token = $this->get('security.token_storage')->getToken();
        $user = $token->getUser();

        $correcto = false;

        if(isset($_POST["nameCompany"]) && $_POST["nameCompany"] != "" && $_POST["nameCompany"] != " ") {
            $company = new Company();
            $company->setName($_POST["nameCompany"]);
            $company->setPhone($_POST["phone"]);
            $company->setAddress($_POST["addressCompany"]);
            $company->setCompanyDepartament($_POST["departamentCompany"]);
            $company->setCompanyCity($_POST["cityCompany"]);
            $company->setPrivacy($_POST["privacyCompany"]);
            $company->setReservation($_POST["reservationCompany"]);
            $company->setOrders($_POST["orderCompany"]);
            $company->setUser($user);
            $manager = $this->getDoctrine()->getManager();
            $manager->persist($company);
            $manager->flush();

            $correcto = true;

            $msgInfo = "Se ha añadido el negocio correctamente.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];

        } else {

            $msgInfo = "Vaya algo salio mal y no se puedo añadir el negocio.";
            $result = [
                "correcto" => $correcto,
                "info" => $msgInfo
            ];

        }

        return new JsonResponse($result);

    }

}
