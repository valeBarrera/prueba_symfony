<?php

namespace App\Controller\Api;

use App\Form\Model\RelationDto;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

class RelationController extends AbstractFOSRestController
{
    /**
     * @Rest\Post(path="/asignate")
     * @Rest\View(serializerGroups={"group"}, serializerEnableMaxDepthChecks=true)
     */
    public function asignate(
        Request $request, 
        LoggerInterface $logger, 
        EntityManagerInterface $em
    )
    {
       $relationDto = new RelationDto();
       $form = $this->createForm(RelationFormType::class, $relationDto);
       $form->handleRequest($request);
       if($form->isSubmitted() && $form->isValid()){
           
       }
       return $form;
    } 
}