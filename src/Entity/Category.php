<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CategoryRepository")
 */
class Category
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
     * @ORM\ManyToMany(targetEntity="App\Entity\Company", mappedBy="category_collection")
     */
    private $companies;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Plate", mappedBy="category")
     */
    private $plate_collection;

    public function __construct()
    {
        $this->companies = new ArrayCollection();
        $this->plate_collection = new ArrayCollection();
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
     * @return Collection|Company[]
     */
    public function getCompanies(): Collection
    {
        return $this->companies;
    }

    public function addCompany(Company $company): self
    {
        if (!$this->companies->contains($company)) {
            $this->companies[] = $company;
            $company->addCategoryCollection($this);
        }

        return $this;
    }

    public function removeCompany(Company $company): self
    {
        if ($this->companies->contains($company)) {
            $this->companies->removeElement($company);
            $company->removeCategoryCollection($this);
        }

        return $this;
    }

    /**
     * @return Collection|Plate[]
     */
    public function getPlateCollection(): Collection
    {
        return $this->plate_collection;
    }

    public function addPlateCollection(Plate $plateCollection): self
    {
        if (!$this->plate_collection->contains($plateCollection)) {
            $this->plate_collection[] = $plateCollection;
            $plateCollection->setCategory($this);
        }

        return $this;
    }

    public function removePlateCollection(Plate $plateCollection): self
    {
        if ($this->plate_collection->contains($plateCollection)) {
            $this->plate_collection->removeElement($plateCollection);
            // set the owning side to null (unless already changed)
            if ($plateCollection->getCategory() === $this) {
                $plateCollection->setCategory(null);
            }
        }

        return $this;
    }
}
