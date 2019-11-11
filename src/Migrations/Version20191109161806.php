<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191109161806 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE allergy (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE allergy_ingredient (allergy_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_C4A402EBDBFD579D (allergy_id), INDEX IDX_C4A402EB933FE08C (ingredient_id), PRIMARY KEY(allergy_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE company (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, adress VARCHAR(255) DEFAULT NULL, company_city VARCHAR(255) DEFAULT NULL, company_departament VARCHAR(255) DEFAULT NULL, INDEX IDX_4FBF094FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE company_category (company_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_1EDB0CAC979B1AD6 (company_id), INDEX IDX_1EDB0CAC12469DE2 (category_id), PRIMARY KEY(company_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ingredient (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, category VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plate (id INT AUTO_INCREMENT NOT NULL, category_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_719ED75B12469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plate_ingredient (plate_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_8C1B4EFADF66E98B (plate_id), INDEX IDX_8C1B4EFA933FE08C (ingredient_id), PRIMARY KEY(plate_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE allergy_ingredient ADD CONSTRAINT FK_C4A402EBDBFD579D FOREIGN KEY (allergy_id) REFERENCES allergy (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE allergy_ingredient ADD CONSTRAINT FK_C4A402EB933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plate ADD CONSTRAINT FK_719ED75B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE plate_ingredient ADD CONSTRAINT FK_8C1B4EFADF66E98B FOREIGN KEY (plate_id) REFERENCES plate (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plate_ingredient ADD CONSTRAINT FK_8C1B4EFA933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD departament VARCHAR(255) DEFAULT NULL, CHANGE roles roles LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE user_allergy ADD CONSTRAINT FK_93BC5CBFDBFD579D FOREIGN KEY (allergy_id) REFERENCES allergy (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE allergy_ingredient DROP FOREIGN KEY FK_C4A402EBDBFD579D');
        $this->addSql('ALTER TABLE user_allergy DROP FOREIGN KEY FK_93BC5CBFDBFD579D');
        $this->addSql('ALTER TABLE company_category DROP FOREIGN KEY FK_1EDB0CAC12469DE2');
        $this->addSql('ALTER TABLE plate DROP FOREIGN KEY FK_719ED75B12469DE2');
        $this->addSql('ALTER TABLE company_category DROP FOREIGN KEY FK_1EDB0CAC979B1AD6');
        $this->addSql('ALTER TABLE allergy_ingredient DROP FOREIGN KEY FK_C4A402EB933FE08C');
        $this->addSql('ALTER TABLE plate_ingredient DROP FOREIGN KEY FK_8C1B4EFA933FE08C');
        $this->addSql('ALTER TABLE plate_ingredient DROP FOREIGN KEY FK_8C1B4EFADF66E98B');
        $this->addSql('DROP TABLE allergy');
        $this->addSql('DROP TABLE allergy_ingredient');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE company_category');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('DROP TABLE plate');
        $this->addSql('DROP TABLE plate_ingredient');
        $this->addSql('ALTER TABLE user DROP departament, CHANGE roles roles LONGTEXT NOT NULL COLLATE utf8mb4_unicode_ci');
    }
}
