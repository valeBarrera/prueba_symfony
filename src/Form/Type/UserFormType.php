<?php

namespace App\Form\Type;

use App\Form\Model\UserDto;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class)
            ->add('name', TextType::class)
            ->add('lastname', TextType::class)
            ->add('email', TextType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver){
        $resolver->setDefaults([
            'data_class' => UserDto::class,
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }

    public function getName()
    {
        return '';
    }
}