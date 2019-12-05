<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\IssueRepository")
 */
class Issue
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
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $category;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $body_issue;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $read_issue;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $answered;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="bigint", nullable=true)
     */
    private $timecreated;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(?string $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getBodyIssue(): ?string
    {
        return $this->body_issue;
    }

    public function setBodyIssue(?string $body_issue): self
    {
        $this->body_issue = $body_issue;

        return $this;
    }

    public function getReadIssue(): ?bool
    {
        return $this->read_issue;
    }

    public function setReadIssue(?bool $read_issue): self
    {
        $this->read_issue = $read_issue;

        return $this;
    }

    public function getAnswered(): ?bool
    {
        return $this->answered;
    }

    public function setAnswered(?bool $answered): self
    {
        $this->answered = $answered;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

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
}
