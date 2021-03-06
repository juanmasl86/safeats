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

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $country;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $address;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $postal_code;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $image;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $privacy;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Commentary", mappedBy="sender")
     */
    private $commentaries;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Company", inversedBy="followers")
     */
    private $favorites;

    public function __construct()
    {
        $this->allergy_collection = new ArrayCollection();
        $this->company_collection = new ArrayCollection();
        $this->commentaries = new ArrayCollection();
        $this->favorites = new ArrayCollection();
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
        return $this->roles;
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
        $this->name = $username;

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

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): self
    {
        $this->country = $country;

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

    public function getPostalCode(): ?int
    {
        return $this->postal_code;
    }

    public function setPostalCode(?int $postal_code): self
    {
        $this->postal_code = $postal_code;

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

    /**
     * @return Collection|Commentary[]
     */
    public function getCommentaries(): Collection
    {
        return $this->commentaries;
    }

    public function addCommentary(Commentary $commentary): self
    {
        if (!$this->commentaries->contains($commentary)) {
            $this->commentaries[] = $commentary;
            $commentary->setSender($this);
        }

        return $this;
    }

    public function removeCommentary(Commentary $commentary): self
    {
        if ($this->commentaries->contains($commentary)) {
            $this->commentaries->removeElement($commentary);
            // set the owning side to null (unless already changed)
            if ($commentary->getSender() === $this) {
                $commentary->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Company[]
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Company $favorite): self
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites[] = $favorite;
        }

        return $this;
    }

    public function removeFavorite(Company $favorite): self
    {
        if ($this->favorites->contains($favorite)) {
            $this->favorites->removeElement($favorite);
        }

        return $this;
    }

}
