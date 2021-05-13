<?php

namespace App\Controller\Api;

use App\Entity\Group;
use App\Form\Model\GroupDto;
use App\Repository\GroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

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
        EntityManagerInterface $em
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
           return $group;
           $logger->info('Group creation request successfully');
       }
       return $form;
    } 
}