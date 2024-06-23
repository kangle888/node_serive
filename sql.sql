/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 8.0.34 : Database - codeerhub
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`codeerhub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `codeerhub`;

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `moment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_id` int DEFAULT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `moment_id` (`moment_id`),
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`moment_id`) REFERENCES `moment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `comment` */

insert  into `comment`(`id`,`content`,`moment_id`,`user_id`,`comment_id`,`createAt`,`updateAt`) values 
(1,'鸡你太美',2,6,NULL,'2024-04-06 16:08:41','2024-04-06 16:08:41'),
(2,'鸡你太臭去挨到阿斯顿阿斯顿阿三',2,6,1,'2024-04-06 16:13:25','2024-04-06 16:13:25');

/*Table structure for table `moment` */

DROP TABLE IF EXISTS `moment`;

CREATE TABLE `moment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `user_id` int NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `moment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `moment` */

insert  into `moment`(`id`,`content`,`user_id`,`createAt`,`updateAt`) values 
(2,'我是风儿你是沙，缠缠绵问问绵走天=古典风格的是fw涯哈哈哈',1,'2024-04-06 10:35:59','2024-04-06 11:47:55'),
(3,'曾几何时，他也好，她也好，都是这家伙的被害者。所以我才憎恶着。这个强求着所谓“大家”的世界。必须建立在牺牲某人之上才能成立的低劣的和平。以温柔和正义粉饰，明明是恶毒之物却登大雅之堂，随着时间的流逝越发凶恶，除欺瞒外别无其二的空虚的概念。过去和世界都是无法改变的。发生过的事情和所谓的“大家”都是无法改变的。但是，并不是说自己只能隶属于他们',1,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(4,'不要告诉我你不需要保护，不要告诉我你不寂寞，知微，我只希望你，在走过黑夜的那个时辰，不要倔强的选择一个人。',3,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(5,'我是风儿你是沙，缠缠绵问问绵走天涯哈哈哈',1,'2024-04-06 10:35:59','2024-04-06 11:29:26'),
(6,'在世间万物中我都发现了你，渺小时，你是阳光下一粒种子，伟大时，你隐身在高山海洋里。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(7,'某一天，突然发现，许多结果都与路径无关。',4,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(8,'限定目的，能使人生变得简洁。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(9,'翅膀长在你的肩上，太在乎别人对于飞行姿势的批评，所以你飞不起来',4,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(10,'一个人至少拥有一个梦想，有一个理由去坚强。心若没有栖息的地方，到哪里都是在流浪。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(11,'不乱于心，不困于情。不畏将来，不念过往。如此，安好。',3,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(12,'如果你给我的，和你给别人的是一样的，那我就不要了。',3,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(13,'故事的开头总是这样，适逢其会，猝不及防。故事的结局总是这样，花开两朵，天各一方。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(14,'我是风儿你是沙，缠缠绵问问绵走天涯哈哈哈',2,'2024-04-06 10:35:59','2024-04-06 11:31:23'),
(15,'我是风儿你是沙，缠缠绵问问绵走天涯哈哈哈',4,'2024-04-06 10:35:59','2024-04-06 11:30:21'),
(16,'每一个不曾起舞的日子，都是对生命的辜负。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(17,'向来缘浅，奈何情深。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(18,'心之所向 素履以往 生如逆旅 一苇以航',3,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(19,'生如夏花之绚烂，死如秋叶之静美。',3,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(20,'答案很长，我准备用一生的时间来回答，你准备要听了吗？',4,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(21,'因为爱过，所以慈悲；因为懂得，所以宽容。',4,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(22,'我们听过无数的道理，却仍旧过不好这一生。',1,'2024-04-06 10:35:59','2024-04-06 10:35:59'),
(23,'我来不及认真地年轻，待明白过来时，只能选择认真地老去。',2,'2024-04-06 10:35:59','2024-04-06 10:35:59');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`name`,`password`,`createAt`,`updateAt`) values 
(1,'王五','fcea920f7412b5da7be0cf42b8c93759','2024-04-06 10:35:06','2024-04-06 10:35:06'),
(2,'王麻子','fcea920f7412b5da7be0cf42b8c93759','2024-04-06 10:35:06','2024-04-06 10:35:06'),
(3,'李四','f8f09bd36b0072bf667cac8f8da8f744','2024-04-05 14:01:15','2024-04-05 14:01:15'),
(4,'李四1','f8f09bd36b0072bf667cac8f8da8f744','2024-04-05 14:02:03','2024-04-05 14:02:03'),
(5,'张三','e10adc3949ba59abbe56e057f20f883e','2024-04-05 17:54:59','2024-04-05 17:54:59'),
(6,'张四','fcea920f7412b5da7be0cf42b8c93759','2024-04-05 18:17:31','2024-04-05 18:17:31'),
(7,'张三223','e10adc3949ba59abbe56e057f20f883e','2024-04-24 23:41:41','2024-04-24 23:41:41'),
(8,'张三22111','e10adc3949ba59abbe56e057f20f883e','2024-04-24 23:42:56','2024-04-24 23:42:56'),
(9,'张三2111','e10adc3949ba59abbe56e057f20f883e','2024-04-24 23:45:08','2024-04-24 23:45:08'),
(10,'张三789789','e10adc3949ba59abbe56e057f20f883e','2024-04-25 00:09:24','2024-04-25 00:09:24'),
(11,'xukangle','e10adc3949ba59abbe56e057f20f883e','2024-06-22 22:32:19','2024-06-22 22:32:19');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
