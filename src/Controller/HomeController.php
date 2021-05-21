<?php

namespace App\Controller;

use App\Entity\Group;
use App\Entity\User;
use App\Form\GroupViewFormType;
use App\Form\Model\RelationDto;
use App\Form\RelationViewFormType;
use App\Form\UserViewFormType;
use App\Repository\GroupRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use Omines\DataTablesBundle\Adapter\Doctrine\ORMAdapter;
use Omines\DataTablesBundle\Column\TextColumn;
use Omines\DataTablesBundle\DataTableFactory;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    public function __construct(GroupRepository $groupRepository, UserRepository $userRepository)
    {
        $this->groupRepository = $groupRepository;
        $this->userRepository = $userRepository;
    }


    /**
     * @Route("/register-user",name="register_user")
    */
    public function formRegisterUser(
        Request $request,
        LoggerInterface $logger,
        EntityManagerInterface $em
    ): Response {
        $title = 'Formulario de Registro de Nuevo Usuario';
        $user =  new User();
        $form = $this->createForm(UserViewFormType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($user);
            $em->flush();
            $logger->info('User creation request successfully');
            return $this->redirectToRoute('user_table');
        }

        return $this->render('/user/form-register-user.html.twig', [
            'title' => $title,
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/register-group",name="register_group")
     */
    public function formRegisterGroup(
        Request $request,
        LoggerInterface $logger,
        EntityManagerInterface $em
    ): Response {
        $title = 'Formulario de Registro de Nuevo Usuario';
        $group =  new Group();
        $form = $this->createForm(GroupViewFormType::class, $group);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($group);
            $em->flush();
            $logger->info('User creation request successfully');
            return $this->redirectToRoute('group_table');
        }

        return $this->render('/group/form-register-group.html.twig', [
            'title' => $title,
            'form' => $form->createView()
        ]);
    }

    
    /**
     * @Route("/user-table",name="user_table")
     */
    public function createTableUser(
        LoggerInterface $logger,
        DataTableFactory $dataTableFactory,
        Request $request
    ) {
        // Actions -> new export show edit delete
        $actions = array('new', 'show', 'edit', 'delete', 'asign');
        // Datatable
        $dataTable = $dataTableFactory->create();
        $dataTable
            ->add('username', TextColumn::class, array('label' => 'Usuario'))
            ->add('name', TextColumn::class, array('label' => 'Nombre'))
            ->add('lastname', TextColumn::class, array('label' => 'Apellido'))
            ->add('email', TextColumn::class, array('label' => 'Email'))
            ->add('groups', TextColumn::class, array(
                'label' => 'Grupos',
                'render' => function($value, $context) {
                    $id_user = $context->getId();
                    
                    $user = $this->userRepository->find($id_user);
                    $html_str = '';
                    foreach ($user->getListgroups() as $group) {
                        $html_str .= sprintf("<p>%s %s</p>", $group->getName(), $group->getDescription());
                    }
                    if($html_str === ''){
                        $html_str = 'Sin grupos asignados';
                    }
                    return $html_str;
                }
            ))
            ->add('id', TextColumn::class, array('label' => 'Acciones', 'raw' => true,
                'render' => function ($value = '%s') use ($actions) {
                    $btns = '';
                    if (in_array('show', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('user_show', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fa fa-eye" style="cursor:pointer;" title="Ver user"></i>
                                </a>';
                    }
                    if (in_array('edit', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('user_edit', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fas fa-pencil-alt" style="cursor:pointer;" title="Editar user"></i>
                                </a>';
                    }
                    if (in_array('delete', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('user_delete', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fas fa-trash-alt" style="cursor:pointer;" title="Borrar user"></i>
                                </a>';
                    }
                    if (in_array('asign', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('user_asign_group', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fas fa-users" style="cursor:pointer;" title="Borrar user"></i>
                                </a>';
                    }
                    return $btns;
                },
            ))
            ->createAdapter(ORMAdapter::class, [
                'entity' => User::class,
                'query' => function (QueryBuilder $builder) {
                    $builder
                        ->select('e')
                        ->from(User::class, 'e')
                    ;
                },
            ])
            ->handleRequest($request);
        $logger->info('User update request failed');
        if ($dataTable->isCallback()) {
            return $dataTable->getResponse();
        }

        return $this->render('/user/table-user.html.twig', ['datatable' => $dataTable,'actions' => $actions, 'title' => 'Usuarios Registrados']);
    }

    /**
     * @Route("user/show/{id}", name="user_show", methods={"GET"})
     */
    public function show(User $user): Response
    {
        return $this->render('user/user-show.html.twig', [
            'user' => $user,
        ]);
    }

    /**
     * @Route("/{id}", name="user_edit", methods={"GET","POST"})
     */
    public function edit(User $user, Request $request): Response
    {
        $form = $this->createForm(UserViewFormType::class, $user);
        $form->handleRequest($request);
        $title = 'Edición de usuario';

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'User Edited!');
            return $this->redirectToRoute('user_table', [
                'id' => $user->getId(),
            ]);
        }

        return $this->render('/user/form-register-user.html.twig', [
            'user' => $user,
            'title' => $title,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="user_delete", methods={"GET","POST"})
     */
    public function delete(Request $request, User $user): Response
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($user);
        $em->flush();

        $this->addFlash('success', 'User Deleted!');
        
        return $this->redirectToRoute('user_table');
    }

    /**
     * @Route("/user-asign-group/{id}",name="user_asign_group", methods={"GET","POST"})
     */
    public function formAsignateGroupUser(
        Request $request,
        LoggerInterface $logger,
        EntityManagerInterface $em
    ): Response {
        $title = 'Asignate User to Group Form';
        $relation =  new RelationDto();
        $form = $this->createForm(RelationViewFormType::class, $relation);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $user = $em->find(User::class, $relation->user_id);
            $group = $em->find(Group::class, $relation->group_id);

            $user->addListgroup($group);
            $group->addListuser($user);
            $em->persist($user);
            $em->persist($group);
            $em->flush();
            $logger->info('Relation request successfully');
            return $this->redirectToRoute('group_table');
        }

        return $this->render('asignate-group-user.html.twig', [
            'title' => $title,
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("group/group-table",name="group_table")
     */
    public function createTableGroup(
        LoggerInterface $logger,
        DataTableFactory $dataTableFactory,
        Request $request
    ) {
        // Actions -> new export show edit delete
        $actions = array('new', 'show', 'edit', 'delete');
        // Datatable
        $dataTable = $dataTableFactory->create();
        $dataTable
            ->add('name', TextColumn::class, array('label' => 'Nombre'))
            ->add('description', TextColumn::class, array('label' => 'Descripción'))
            ->add('users', TextColumn::class, array(
                'label' => 'Usuarios',
                'render' => function($value, $context) {
                    $id_group = $context->getId();
                    
                    $group = $this->groupRepository->find($id_group);
                    $html_str = '';
                    foreach ($group->getListuser() as $user) {
                        $html_str .= sprintf("<p>%s %s</p>", $user->getName(), $user->getLastname());
                    }
                    if($html_str === ''){
                        $html_str = 'Sin usuarios asignados';
                    }
                    return $html_str;
                }
            ))
            ->add('id', TextColumn::class, array('label' => 'Acciones', 'raw' => true,
                'render' => function ($value = '%s') use ($actions) {
                    $btns = '';
                    if (in_array('show', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('group_show', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fa fa-eye" style="cursor:pointer;" title="Ver grupo"></i>
                                </a>';
                    }
                    if (in_array('edit', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('group_edit', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fas fa-pencil-alt" style="cursor:pointer;" title="Editar grupo"></i>
                                </a>';
                    }
                    if (in_array('delete', $actions)) {
                        $btns .= '<a href="' . $this->generateUrl('group_delete', array('id' => $value)) . '">
                                    <i aria-hidden="true" class="fas fa-trash-alt" style="cursor:pointer;" title="Borrar grupo"></i>
                                </a>';
                    }
                    return $btns;
                },
            ))

            ->createAdapter(ORMAdapter::class, [
                'entity' => Group::class,
                'query' => function (QueryBuilder $builder) {
                    $builder
                        ->select('e')
                        ->from(Group::class, 'e')
                    ;
                },
            ])
            ->handleRequest($request);


        $logger->info('User update request failed');
        if ($dataTable->isCallback()) {
            return $dataTable->getResponse();
        }

        return $this->render('/group/table-group.html.twig', ['datatable' => $dataTable,'actions' => $actions, 'title' => 'Grupos Registrados']);
    }

    /**
     * @Route("/show/{id}", name="group_show", methods={"GET"})
     */
    public function groupShow(Group $group): Response
    {
        return $this->render('group/group-show.html.twig', [
            'group' => $group,
        ]);
    }

    /**
     * @Route("/{id}", name="group_edit", methods={"GET","POST"})
     */
    public function groupEdit(Request $request, Group $group): Response
    {
        $form = $this->createForm(GroupViewFormType::class, $group);
        $form->handleRequest($request);
        $title = 'Edición de grupo';

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'Group Edited!');
            return $this->redirectToRoute('group_table', [
                'id' => $group->getId(),
            ]);
        }

        return $this->render('/group/form-register-group.html.twig', [
            'group' => $group,
            'title' => $title,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="group_delete", methods={"GET","POST"})
     */
    public function groupDelete(Request $request, Group $group): Response
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($group);
        $em->flush();

        $this->addFlash('success', 'Group Deleted!');
        
        return $this->redirectToRoute('group_table');
    }
}
