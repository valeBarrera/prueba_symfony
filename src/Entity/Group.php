<?php

namespace App\Entity;

use App\Repository\GroupRepository;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=GroupRepository::class)
 * @ORM\Table(name="`group`")
 */
class Group
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
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $description;

    /**
     * @var Collection|User[]
     * @MaxDepth(1)
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="listgroups")
     */
    private $listuser;


    public function __construct()
    {
        $this->listuser = new ArrayCollection();
    }

    public function setUser(User $user){
        $this->users->add($user);
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getListuser(): Collection
    {
        return $this->listuser;
    }

    public function addListuser(User $listuser): self
    {
        if (!$this->listuser->contains($listuser)) {
            $this->listuser[] = $listuser;
            $listuser->addListgroup($this);
        }

        return $this;
    }

    public function removeListuser(User $listuser): self
    {
        if ($this->listuser->removeElement($listuser)) {
            $listuser->removeListgroup($this);
        }

        return $this;
    }
}
