<?php

namespace App\Form;

use App\Form\Model\RelationDto;
use App\Repository\GroupRepository;
use App\Repository\UserRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RelationViewFormType extends AbstractType
{
    public function __construct(UserRepository $userRepository, GroupRepository $groupRepository)
    {
        $this->userRepository=$userRepository;
        $this->groupRepository=$groupRepository;


    }
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $users = $this->userRepository->findAll();
        $users_data = array();
        foreach ($users as $user) {
            $users_data[$user->getName()]=$user->getId();
        }

        $groups = $this->groupRepository->findAll();
        $groups_data = array();
        foreach ($groups as $group) {
            $groups_data[$group->getName()]=$group->getId();
        }

        $builder
            ->add('user_id')
            ->add('group_id', ChoiceType::class, array(
                'label' => 'Selección grupo',
                'choices' => $groups_data,
                'placeholder' => 'Seleccione grupo',
            ))
            ->add('save', SubmitType::class, array(
                'label'=>'Registrar Asignación'
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => RelationDto::class
        ]);
    }
}
