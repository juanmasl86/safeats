<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlateRepository")
 */
class Plate
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="plate_collection")
     */
    private $category;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Ingredient", inversedBy="plates")
     */
    private $ingredient_collection;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $id_company;

    public function __construct()
    {
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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection|Ingredient[]
     */
    public function getIngredientCollection(): Collection
    {
        return $this->ingredient_collection;
    }

    public function addIngredientCollection(Ingredient $ingredientCollection): self
    {
        if (!$this->ingredient_collection->contains($ingredientCollection)) {
            $this->ingredient_collection[] = $ingredientCollection;
        }

        return $this;
    }

    public function removeIngredientCollection(Ingredient $ingredientCollection): self
    {
        if ($this->ingredient_collection->contains($ingredientCollection)) {
            $this->ingredient_collection->removeElement($ingredientCollection);
        }

        return $this;
    }

    public function getIdCompany(): ?int
    {
        return $this->id_company;
    }

    public function setIdCompany(?int $id_company): self
    {
        $this->id_company = $id_company;

        return $this;
    }
}
