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
    private $address;

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

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $image;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $privacy;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $reservation;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $orders;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $phone;

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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getPrivacy(): ?bool
    {
        return $this->privacy;
    }

    public function setPrivacy(?bool $privacy): self
    {
        $this->privacy = $privacy;

        return $this;
    }

    public function getReservation(): ?bool
    {
        return $this->reservation;
    }

    public function setReservation(?bool $reservation): self
    {
        $this->reservation = $reservation;

        return $this;
    }

    public function getOrders(): ?bool
    {
        return $this->orders;
    }

    public function setOrders(?bool $orders): self
    {
        $this->orders = $orders;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }
}
