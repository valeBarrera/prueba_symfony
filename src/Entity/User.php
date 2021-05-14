<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="`user`")
 */
class User
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=59)
     */
    private $email;

    /**
     * @var Collection|Group[]
     * @MaxDepth(1)
     * @ORM\ManyToMany(targetEntity=Group::class, inversedBy="listuser")
     */
    private $listgroups;

    public function __construct()
    {
        $this->listgroups = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection|Group[]
     */
    public function getListgroups(): Collection
    {
        return $this->listgroups;
    }

    public function addListgroup(Group $listgroup): self
    {
        if (!$this->listgroups->contains($listgroup)) {
            $this->listgroups[] = $listgroup;
        }

        return $this;
    }

    public function removeListgroup(Group $listgroup): self
    {
        $this->listgroups->removeElement($listgroup);

        return $this;
    }
}
