<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommentaryRepository")
 */
class Commentary
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
    private $menssage;

    /**
     * @ORM\Column(type="bigint", nullable=true)
     */
    private $timecreated;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="commentaries")
     */
    private $sender;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Company", inversedBy="commentaries")
     */
    private $companyReceiver;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMenssage(): ?string
    {
        return $this->menssage;
    }

    public function setMenssage(?string $menssage): self
    {
        $this->menssage = $menssage;

        return $this;
    }

    public function getTimecreated(): ?int
    {
        return $this->timecreated;
    }

    public function setTimecreated(?int $timecreated): self
    {
        $this->timecreated = $timecreated;

        return $this;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    public function getCompanyReceiver(): ?Company
    {
        return $this->companyReceiver;
    }

    public function setCompanyReceiver(?Company $companyReceiver): self
    {
        $this->companyReceiver = $companyReceiver;

        return $this;
    }
}
