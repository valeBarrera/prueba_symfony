<?php

namespace App\Form;

use App\Entity\Group;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class GroupViewFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array(
                'label'=>'Nombre',
                'attr'=>array(
                    'placeholder' => 'Escriba el nombre del grupo'
                )
            ))
            ->add('description', TextType::class, array(
                'label'=>'Descripción',
                'attr'=>array(
                    'placeholder' => 'Escriba la descripción del grupo'
                )
            ))
            ->add('save', SubmitType::class, array(
                'label'=>'Registrar Grupo'
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Group::class,
        ]);
    }
}
