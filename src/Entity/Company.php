<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CompanyRepository")
 */
class Company
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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adress;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $company_city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $company_departament;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="company_collection")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Category", inversedBy="companies")
     */
    private $category_collection;

    public function __construct()
    {
        $this->category_collection = new ArrayCollection();
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

    public function getAdress(): ?string
    {
        return $this->adress;
    }

    public function setAdress(?string $adress): self
    {
        $this->adress = $adress;

        return $this;
    }

    public function getCompanyCity(): ?string
    {
        return $this->company_city;
    }

    public function setCompanyCity(?string $company_city): self
    {
        $this->company_city = $company_city;

        return $this;
    }

    public function getCompanyDepartament(): ?string
    {
        return $this->company_departament;
    }

    public function setCompanyDepartament(?string $company_departament): self
    {
        $this->company_departament = $company_departament;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Category[]
     */
    public function getCategoryCollection(): Collection
    {
        return $this->category_collection;
    }

    public function addCategoryCollection(Category $categoryCollection): self
    {
        if (!$this->category_collection->contains($categoryCollection)) {
            $this->category_collection[] = $categoryCollection;
        }

        return $this;
    }

    public function removeCategoryCollection(Category $categoryCollection): self
    {
        if ($this->category_collection->contains($categoryCollection)) {
            $this->category_collection->removeElement($categoryCollection);
        }

        return $this;
    }
}
