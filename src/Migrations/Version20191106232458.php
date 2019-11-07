<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191106232458 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE allergy_ingredient (allergy_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_C4A402EBDBFD579D (allergy_id), INDEX IDX_C4A402EB933FE08C (ingredient_id), PRIMARY KEY(allergy_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE company_category (company_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_1EDB0CAC979B1AD6 (company_id), INDEX IDX_1EDB0CAC12469DE2 (category_id), PRIMARY KEY(company_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plate_ingredient (plate_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_8C1B4EFADF66E98B (plate_id), INDEX IDX_8C1B4EFA933FE08C (ingredient_id), PRIMARY KEY(plate_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE allergy_ingredient ADD CONSTRAINT FK_C4A402EBDBFD579D FOREIGN KEY (allergy_id) REFERENCES allergy (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE allergy_ingredient ADD CONSTRAINT FK_C4A402EB933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plate_ingredient ADD CONSTRAINT FK_8C1B4EFADF66E98B FOREIGN KEY (plate_id) REFERENCES plate (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plate_ingredient ADD CONSTRAINT FK_8C1B4EFA933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plate ADD category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE plate ADD CONSTRAINT FK_719ED75B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_719ED75B12469DE2 ON plate (category_id)');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE municipios (id BIGINT AUTO_INCREMENT NOT NULL, provincia INT NOT NULL, municipio VARCHAR(255) NOT NULL COLLATE latin1_spanish_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = MyISAM COMMENT = \'\' ');
        $this->addSql('CREATE TABLE provincias (id INT AUTO_INCREMENT NOT NULL, provincia VARCHAR(255) NOT NULL COLLATE latin1_spanish_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = MyISAM COMMENT = \'\' ');
        $this->addSql('DROP TABLE allergy_ingredient');
        $this->addSql('DROP TABLE company_category');
        $this->addSql('DROP TABLE plate_ingredient');
        $this->addSql('ALTER TABLE plate DROP FOREIGN KEY FK_719ED75B12469DE2');
        $this->addSql('DROP INDEX IDX_719ED75B12469DE2 ON plate');
        $this->addSql('ALTER TABLE plate DROP category_id');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT NOT NULL COLLATE utf8mb4_unicode_ci');
    }
}
