<?php

namespace App\Controller\Api;

use App\Entity\Group;
use App\Form\Model\GroupDto;
use App\Form\Type\GroupFormType;
use App\Repository\GroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class GroupsController extends AbstractFOSRestController
{
    private $logger;

     /**
     * @Rest\Get(path="/groups")
     * @Rest\View(serializerGroups={"group"}, serializerEnableMaxDepthChecks=true)
     */

    public function getAction(
        GroupRepository $groupRepository
    ){
        return $groupRepository->findAll();
    }

    /**
     * @Rest\Post(path="/groups")
     * @Rest\View(serializerGroups={"group"}, serializerEnableMaxDepthChecks=true)
     */
    public function store(
        Request $request, 
        LoggerInterface $logger, 
        EntityManagerInterface $em,
        SerializerInterface $serializer
    )
    {
       $groupDto = new GroupDto();
       $form = $this->createForm(GroupFormType::class, $groupDto);
       $form->handleRequest($request);
       if($form->isSubmitted() && $form->isValid()){
           $group = new Group();
           $group->setName($groupDto->name);
           $group->setDescription($groupDto->description);
           $em->persist($group);
           $em->flush(); 
           $logger->info('Group creation request successfully');
           $data = $serializer->serialize($group, 'json');
           $data = json_decode($data);
           return new JsonResponse(array("message" => "Successful user creation", "code"=> 200, "data" => $data), Response::HTTP_OK);
           
       }
       $logger->info('Group creation request error');
       return $form;
    } 

    /**
     * @Rest\Put(path="/groups/{id}")
     * @Rest\View(serializerGroups={"group"}, serializerEnableMaxDepthChecks=true)
     */
    public function update(
        int $id, 
        Request $request, 
        LoggerInterface $logger, 
        EntityManagerInterface $em,
        SerializerInterface $serializer
    )
    {
       $data = json_decode($request->getContent(), true);
       $groupDto = new GroupDto();
       $form = $this->createForm(GroupFormType::class, $groupDto);
       $form->submit($data);
       if($form->isSubmitted() && $form->isValid()){
            $group = $em->find(Group::class, $id);
            $group->setName($groupDto->name);
            $group->setDescription($groupDto->description);
            $em->persist($group);
            $em->flush(); 
            $logger->info('Group update request successfully');
            $data = $serializer->serialize($group, 'json');
            $data = json_decode($data);
            return new JsonResponse(array("message" => "Successful user update", "code"=> 200, "data" => $data), Response::HTTP_OK);
       }
       $logger->info('Group update request error');
       return $form;
    } 
}