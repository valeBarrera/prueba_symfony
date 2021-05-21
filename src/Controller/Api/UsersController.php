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
use FOS\RestBundle\Serializer\Serializer;
use Monolog\Logger;
use Omines\DataTablesBundle\DataTableFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

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
        EntityManagerInterface $em,
        SerializerInterface $serializer
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
           $logger->info('User creation request successfully');
           $data = $serializer->serialize($user, 'json');
           $data = json_decode($data);
           return new JsonResponse(array("message" => "Successful user creation", "code"=> 200, "data" => $data), Response::HTTP_OK);
           
       }
       $logger->info('User creation request failed');
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
        Request $request,
        Logger $logger,
        SerializerInterface $serializer
    )
    {
        $data = json_decode($request->getContent(), true);
        $userDto = new UserDto();
        $form = $this->createForm(UserFormType::class, $userDto);
        $form->submit($data);
        if($form->isSubmitted() && $form->isValid()){
            $user = new User();
            $user->setUserName($userDto->username);
            $user->setName($userDto->name);
            $user->setLastName($userDto->lastname);
            $user->setEmail($userDto->email);
            $em->persist($user);
            $em->flush(); 
            $data = $serializer->serialize($user, 'json');
            $data = json_decode($data);
            return new JsonResponse(array("message" => "Successful user update", "code"=> 200, "data" => $data), Response::HTTP_OK);
            return $user;
            
        }
        $logger->info('User update request failed');
        return $form;
    } 

   
    
}