<?php

namespace App\Controller\Api;

use App\Entity\Group;
use App\Entity\User;
use App\Form\Model\RelationDto;
use App\Form\Type\RelationFormType;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Psr\Log\LoggerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
            $user = $em->find(User::class, $relationDto->user_id);
            $group = $em->find(Group::class, $relationDto->group_id);

            $user->addListgroup($group);
            $group->addListuser($user);
            $em->persist($user);
            $em->persist($group);
            $em->flush();

            $logger->info('User asginate to Group request successfully');

            return new JsonResponse(array("message" => "Asignate complete successfull", "code"=> 204), Response::HTTP_OK);
       }
       $logger->info('User asginate to Group request error');
       return $form;
    } 
}