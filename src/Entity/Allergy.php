<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AllergyRepository")
 */
class Allergy
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", mappedBy="allergy_collection")
     */
    private $users;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Ingredient", inversedBy="allergies")
     */
    private $ingredient_collection;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $type;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->ingredient_collection = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->addAllergyCollection($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            $user->removeAllergyCollection($this);
        }

        return $this;
    }

    /**
     * @return Collection|ingredient[]
     */
    public function getIngredientCollection(): Collection
    {
        return $this->ingredient_collection;
    }

    public function addIngredientCollection(ingredient $ingredientCollection): self
    {
        if (!$this->ingredient_collection->contains($ingredientCollection)) {
            $this->ingredient_collection[] = $ingredientCollection;
        }

        return $this;
    }

    public function removeIngredientCollection(ingredient $ingredientCollection): self
    {
        if ($this->ingredient_collection->contains($ingredientCollection)) {
            $this->ingredient_collection->removeElement($ingredientCollection);
        }

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
