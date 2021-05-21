<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserViewFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, array(
                'label'=>'Nombre de usuario',
                'attr'=>array(
                    'placeholder' => 'Escriba su nombre de usuario'
                )
            ))
            ->add('name', TextType::class, array(
                'label'=>'nombre',
                'attr'=>array(
                    'placeholder' => 'Escriba su nombre'
                )
            ))
            ->add('lastname', TextType::class, array(
                'label'=>'apellido',
                'attr'=>array(
                    'placeholder' => 'Escriba su apellido'
                )
            ))
            ->add('email', EmailType::class, array(
                'label'=>'email',
                'attr'=>array(
                    'placeholder' => 'Escriba su email'
                )
            ))
            ->add('save', SubmitType::class, array(
                'label'=>'Registrar Usuario'
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
