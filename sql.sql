/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 8.0.36 : Database - codeerhub
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

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `menu` */

insert  into `menu`(`id`,`name`,`type`,`url`,`icon`,`sort`,`parent_id`) values 
(1,'系统总览',1,'/main/analysis','Position',1,NULL),
(2,'文件上传',2,'/main/analysis/uploadFile','el-icon-monitor',106,1),
(3,'虚拟列表',2,'/main/analysis/overview','el-icon-monitor',107,1),
(4,'优化相关',3,'/main/system','Position',3,NULL),
(5,'打包优化',4,'/main/system/role','settings-icon',4,4),
(6,'版本提示',4,'/main/system/user','settings-icon',5,4),
(7,'容器表单',2,'/main/analysis/containerForm','Position',6,1);

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

/*Table structure for table `role_menu` */

DROP TABLE IF EXISTS `role_menu`;

CREATE TABLE `role_menu` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `role_menu_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `role_menu` */

insert  into `role_menu`(`role_id`,`menu_id`) values 
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `roles` */

insert  into `roles`(`id`,`role_name`,`description`) values 
(1,'admin','Administrator role'),
(2,'common_user','Regular user role');

/*Table structure for table `uploaded_images_files` */

DROP TABLE IF EXISTS `uploaded_images_files`;

CREATE TABLE `uploaded_images_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filehash` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filePath` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filehash` (`filehash`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `uploaded_images_files` */

insert  into `uploaded_images_files`(`id`,`filehash`,`filename`,`filePath`,`created_at`) values 
(13,'f38b610faa9c9a7201a10337d9bd88bd','44.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\f38b610faa9c9a7201a10337d9bd88bd.png','2024-09-15 15:20:25'),
(14,'a2a91ef73e82d91bc6fc88404c185c01','1.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\a2a91ef73e82d91bc6fc88404c185c01.png','2024-09-15 15:21:04'),
(15,'99f23ac2e0aa50a402d3953d7b7318bf','2.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\99f23ac2e0aa50a402d3953d7b7318bf.png','2024-09-15 15:21:04'),
(16,'9a5d5826bf1357fb9774974dba24bbc4','毕业z.jpg','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\9a5d5826bf1357fb9774974dba24bbc4.jpg','2024-09-15 15:28:33'),
(17,'bbf074a1d6ec10b68d7ee4ccb07a1187','222.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\bbf074a1d6ec10b68d7ee4ccb07a1187.png','2024-09-15 15:28:39'),
(18,'d03c63153d4d36bfaeb95c30e1aa7705','pic1.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\d03c63153d4d36bfaeb95c30e1aa7705.png','2024-09-15 15:28:39'),
(19,'3982c3fb3e2eaf0f98a8c3cd0413067a','联想截图_20231028150157.png','G:\\node_serve\\08_项目实战-codehub\\codehub\\src\\public\\upload\\3982c3fb3e2eaf0f98a8c3cd0413067a.png','2024-09-16 09:54:46');

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(11,'xukangle','e10adc3949ba59abbe56e057f20f883e','2024-06-22 22:32:19','2024-06-22 22:32:19'),
(12,'xukangle11','490874df393be07d46b1cfdc7aa88037','2024-06-25 22:45:00','2024-06-25 22:45:00');

/*Table structure for table `user_infor_list` */

DROP TABLE IF EXISTS `user_infor_list`;

CREATE TABLE `user_infor_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `name` varchar(100) NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user_infor_list` */

insert  into `user_infor_list`(`id`,`date`,`name`,`enable`,`address`) values 
(1,'2016-05-02','王小虎1',1,'上海市普陀区金沙江路 1518 弄'),
(2,'2016-05-03','王小虎2',1,'上海市普陀区金沙江路 1519 弄'),
(3,'2016-05-04','王小虎3',1,'上海市普陀区金沙江路 1520 弄'),
(4,'2016-05-05','王小虎4',1,'上海市普陀区金沙江路 1521 弄'),
(5,'2016-05-06','王小虎5',1,'上海市普陀区金沙江路 1522 弄'),
(6,'2016-05-07','王小虎6',1,'上海市普陀区金沙江路 1523 弄'),
(7,'2016-05-08','王小虎7',1,'上海市普陀区金沙江路 1524 弄'),
(8,'2016-05-09','王小虎8',1,'上海市普陀区金沙江路 1525 弄'),
(9,'2017-05-02','王小虎1',1,'上海市普陀区金沙江路 1518 弄'),
(10,'2017-05-03','王小虎2',1,'上海市普陀区金沙江路 1519 弄'),
(11,'2013-05-04','王小虎3',1,'上海市普陀区金沙江路 1520 弄'),
(12,'2014-05-05','王小虎4',1,'上海市普陀区金沙江路 1521 弄'),
(13,'2015-05-06','王小虎5',1,'上海市普陀区金沙江路 1522 弄'),
(14,'2016-05-07','王小虎6',1,'上海市普陀区金沙江路 1523 弄'),
(15,'2017-05-08','王小虎7',1,'上海市普陀区金沙江路 1524 弄'),
(16,'2016-05-09','王小虎6',1,'上海市普陀区金沙江路 1523 弄'),
(17,'2017-05-10','王小虎7',1,'上海市普陀区金沙江路 1524 弄');

/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user_roles` */

insert  into `user_roles`(`user_id`,`role_id`) values 
(11,1),
(2,2);

/* Procedure structure for procedure `InsertUsers` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertUsers` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`%` PROCEDURE `InsertUsers`()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 100 DO
        INSERT INTO users (date, name, enable, address)
        VALUES (DATE_ADD('2016-05-02', INTERVAL i DAY), CONCAT('王小虎', i), 1, CONCAT('上海市普陀区金沙江路 1518 弄', i));
        SET i = i + 1;
    END WHILE;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
