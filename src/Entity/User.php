<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields={"email"}, message="There is already an account with this email")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $userlastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $usercity;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $departament;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Allergy", inversedBy="users")
     */
    private $allergy_collection;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Company", mappedBy="user")
     */
    private $company_collection;

    public function __construct()
    {
        $this->allergy_collection = new ArrayCollection();
        $this->company_collection = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getName(): string
    {
        return (string) $this->name;
    }

    public function setName(?string $username): self
    {
        $this->name = $name;

        return $this;
    }

    public function getUserlastname(): ?string
    {
        return $this->userlastname;
    }

    public function setUserlastname(?string $userlastname): self
    {
        $this->userlastname = $userlastname;

        return $this;
    }

    public function getUsercity(): ?string
    {
        return $this->usercity;
    }

    public function setUsercity(?string $usercity): self
    {
        $this->usercity = $usercity;

        return $this;
    }

    public function getDepartament(): ?string
    {
        return $this->departament;
    }

    public function setDepartament(?string $departament): self
    {
        $this->departament = $departament;

        return $this;
    }

    /**
     * @return Collection|Allergy[]
     */
    public function getAllergyCollection(): Collection
    {
        return $this->allergy_collection;
    }

    public function addAllergyCollection(Allergy $allergyCollection): self
    {
        if (!$this->allergy_collection->contains($allergyCollection)) {
            $this->allergy_collection[] = $allergyCollection;
        }

        return $this;
    }

    public function removeAllergyCollection(Allergy $allergyCollection): self
    {
        if ($this->allergy_collection->contains($allergyCollection)) {
            $this->allergy_collection->removeElement($allergyCollection);
        }

        return $this;
    }

    /**
     * @return Collection|Company[]
     */
    public function getCompanyCollection(): Collection
    {
        return $this->company_collection;
    }

    public function addCompanyCollection(Company $companyCollection): self
    {
        if (!$this->company_collection->contains($companyCollection)) {
            $this->company_collection[] = $companyCollection;
            $companyCollection->setUser($this);
        }

        return $this;
    }

    public function removeCompanyCollection(Company $companyCollection): self
    {
        if ($this->company_collection->contains($companyCollection)) {
            $this->company_collection->removeElement($companyCollection);
            // set the owning side to null (unless already changed)
            if ($companyCollection->getUser() === $this) {
                $companyCollection->setUser(null);
            }
        }

        return $this;
    }
}
