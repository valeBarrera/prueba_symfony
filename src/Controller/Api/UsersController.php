<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\Model\UserDto;
use App\Form\Type\UserFormType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;

class UsersController extends AbstractFOSRestController
{
    private $logger;

     /**
     * @Rest\Get(path="/users")
     * @Rest\View(serializerGroups={"user"}, serializerEnableMaxDepthChecks=true)
     */

    public function getAction(
        UserRepository $userRepository
    ){
        return $userRepository->findAll();
    }

    /**
     * @Rest\Post(path="/users")
     * @Rest\View(serializerGroups={"user"}, serializerEnableMaxDepthChecks=true)
     */
    public function store(
        Request $request, 
        LoggerInterface $logger, 
        EntityManagerInterface $em
    )
    {
       $userDto = new UserDto();
       $form = $this->createForm(UserFormType::class, $userDto);
       $form->handleRequest($request);
       if($form->isSubmitted() && $form->isValid()){
           $user = new User();
           $user->setUserName($userDto->username);
           $user->setName($userDto->name);
           $user->setLastName($userDto->lastname);
           $user->setEmail($userDto->email);
           $em->persist($user);
           $em->flush(); 
           return $user;
           $logger->info('User creation request successfully');
       }
       return $form;
    } 

    /**
     * @Rest\Post(path="/uers/{id}", requirements={"id"="\d+"})
     * @Rest\View(serializerGroups={"user"}, serializerEnableMaxDepthChecks=true)
     */
    public function update(
        int $id,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        Request $request
    )
    {
       $user = $userRepository->find($id);
       if(!$user){
           throw $this->createNotFoundException('User not found');
       }
       $userDto = new UserDto();
    } 
}