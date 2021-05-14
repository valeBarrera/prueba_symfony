<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{   
    /**
     * @Route("/",name="create_user")
     */
    public function viewCreateUser(): Response
    {
        $title = 'Formulario';

        return $this->render('create.html.twig', [
            'title' => $title
        ]);
    }

    /**
     * @Route("/asignate",name="asignate_user_to_group")
     */
    public function viewAsignateUser(): Response
    {
        $title = 'Formulario de Asignación';

        return $this->render('asignate.html.twig', [
            'title' => $title
        ]);
    }
}