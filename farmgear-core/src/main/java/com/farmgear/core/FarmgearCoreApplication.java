package com.farmgear.core;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.farmgear.core.mapper")
public class FarmgearCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmgearCoreApplication.class, args);
    }
}
