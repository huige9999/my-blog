---
title: NestJS 教程 15：Redis 缓存实战
date: 2026-03-04
description: 本教程介绍 Redis 的基础知识和在 NestJS 中的应用，包括 Redis 的安装、常用命令（字符串、列表、集合、有序集合、哈希、地理空间、位图），以及在 NestJS 中实现购物车缓存功能的完整案例。
---

## Redis简介与安装

mysql 是通过硬盘来存储信息的，并且还要解析并执行 sql 语句，服务端其实最耗时的操作，就是连接数据等待数据库的查询结果，特别是一些非常耗时的查询，这些就成为了性能瓶颈。

解决这个问题的手段就是缓存，直接把结果缓存在内存中，下次查询直接查询缓存就行了。

所以做后端服务的时候，为了提升查询效率，我们不会只用 mysql，一般会结合内存数据库来做缓存，最常用的是 **Redis**

[Redis](https://redis.io/)是一个开源的内存数据结构存储系统，采用**键-值(Key-Value)对**的形式存储数据。支持多种数据结构，比如：字符串（string）、列表（list）、集合（set）、有序集合（sorted set)、哈希表（hash）、地理信息（geospatial）、位图（bitmap）和JSON等等。Redis将数据存储在内存中，以实现快速查询，因此被广泛用于服务端开发中的中间件。在提升应用性能和处理高并发场景方面，起着至关重要的作用。

Redis 是分为服务端和客户端的，它提供了一个 `redis-cli` 的命令行客户端，当然也有可视化界面。

我们还是通过Docker Desktop直接下载Redis的Image

![Docker Redis 下载](/assets/48.png)

可以直接点击`run`，下载并开启一个容器

![Docker Redis 运行](/assets/49.png)

redis 服务跑起来之后，我们可以先用docker容器中的redis-cli 操作一下。

![redis-cli 操作](/assets/50.png)

## Redis常用命令

上面简单写了一下字符串操作。Redis提供了[一系列操作数据的命令](https://redis.io/docs/latest/develop/data-types/)

### 1、字符串操作

- SET key value：设置键-值对。
- GET key：根据键获取对应的值。
- MGET：获取多个键的值
- DEL key：删除键-值对
- INCR key：将键的值增加1
- INCRBY key increment：将键的值增加指定的增量

![字符串操作](/assets/51.png)

### 2、列表操作

在Redis中，列表通常应用于消息队列、任务队列、时间线等场景，操作其实类似于JS中的数组操作。

列表操作的常用命令如下：

- LPUSH key value：将值推入列表左侧
- RPUSH key value：将值推入列表右侧
- LPOP key value：从列表左侧删除值
- RPOP key value：从列表右侧删除值
- LLEN key：获取列表长度
- LRANGE key start stop：获取列表指定范围的值

![列表操作1](/assets/52.png)

![列表操作2](/assets/53.png)

### 3、集合操作

在Redis中，集合由一组无序但唯一的成员组成。使用集合可以对数据执行交集、并集、差集等操作。

集合常用于标签系统，比如进行文章标签或者商品标签的管理，从而轻松的实现标签的组合和筛选

集合常用命令如下：

- SADD key member：向集合添加成员
- SREM key member：移除集合中的成员
- SMEMBERS key：获取集合的所有成员
- SINTER key1 key2：获取多个集合的交集

![集合操作](/assets/54.png)

### RedisInsight

如果觉得命令行不够清晰，也能下载Redis给我提供了GUI，[官网下载](https://redis.io/insight/#insight-form)即可，不过下载之前需要稍微填写一下信息

![RedisInsight 下载](/assets/55.png)

安装成功之后，就会自动搜索到当前已经启动的Redis服务，点击这个数据库，就可以展示我们前面创建的各种类型的key和value

![RedisInsight 数据库](/assets/56.png)

现在可以通过工作，简单的进行操作即可

![RedisInsight 操作](/assets/57.png)

当然你要写cli命令也可以

![RedisInsight CLI](/assets/58.png)

### 4、有序集合操作

与集合不同，Sorted Set（有序集合，也被称为ZSet）是由一组按照分数排序并且唯一的数据组成的，如果要用于比如排行榜的处理，就可以使用这种数据结构

有序集合常用的操作命令如下：

- ZADD key socre member：向有序集合添加成员及其分数
- ZRANGE key start stop：按分数范围获取有序集合的成员

![有序集合](/assets/59.png)

![有序集合范围](/assets/60.png)

通过命令操作一下

![有序集合操作1](/assets/61.png)

![有序集合操作2](/assets/62.png)

### 5、哈希操作

- HSET key field value：设置哈希字段的值
- HGET key field：获取哈希字段的值
- HGETALL key：获取哈希的所有字段和值

哈希结构适用于存储复杂对象结构的数据，例如用户信息，订单信息等等，每个Key代表不同的对象，field value代表对象的属性和值。比如要存储`user`信息，执行如下的命令设置字段：

```typescript
HSET user id 1
HSET user name jack
HSET user age 22
```

![哈希操作1](/assets/63.png)

![哈希操作2](/assets/64.png)

### 6、地理空间操作

常用命令如下：

- GEOADD key longitude latitude member：根据经纬度添加坐标成员
- GEOPOS key member [member...]：获取一个或多个成员的地理位置坐标
- GEOSEARCH key <FROMMEMBER | FROMLONLAT><BYRADIUS|BYBOX><...>：根据不同条件获取成员坐标
- GEODIST key member1 member2 [unit]：计算坐标成员之间的距离

Redis可以用于存储地理空间的坐标，并支持在给定半径和范围边界内进行搜索。地图相关的场景都会用到这种数据操作，比如共享单车、充电宝等等场景

可以执行以下命令添加几个坐标位置，坐标位置可以用用百度的[坐标拾取器](https://api.map.baidu.com/lbsapi/getpoint/index.html)

```typescript
GEOADD share_bikes 116.437326 39.951837 bike1
GEOADD share_bikes 116.433877 39.94874 bike2 116.436177 39.950952 bike3
```

![地理空间添加](/assets/65.png)

![地理空间数据](/assets/66.png)

比如获取bike1和bike2的坐标信息

![地理空间获取坐标](/assets/67.png)

还能增加一些条件，给定一个经纬度，查询这个坐标5KM范围内的自行车，结果会自动按照从近到远的顺序输出

```typescript
GEOSEARCH share_bikes FROMLONLAT 116.436464 39.94791 BYRADIUS 5 km asc
```

![地理空间搜索](/assets/68.png)

### 7、位图操作

位图常用操作命令如下：

- SETBIT key offset value：给指定偏移量的位设置0或1
- GETBIT key offset：获取指定偏移量的位
- BITCOUNT key：获取指定位位1的总计数

在应用中，如果我们希望记录用户的活跃状态、在线状态、访问频率等等，就可以使用位图。

比如，我们统计用户1001在30天内的访问频率，假设他在第10、20、30天都有访问记录：

```typescript
SETBIT user:1001:visit 10 1
SETBIT user:1001:visit 20 1
SETBIT user:1001:visit 30 1
```

![位图设置](/assets/69.png)

![位图查看](/assets/70.png)

我们通过条件来看一下，比如判断该用户在第15天有没有访问记录：

```typescript
GETBIT user:1001:visit 15
```

![位图获取](/assets/71.png)

或者统计用户总共有多少次访问记录

![位图统计](/assets/72.png)

上面基本上就是一些常用的redis结构和命令，当然还有一些cli并没有一一介绍，大家可以自行去查阅，过一遍基本也就会了。

---

## Nest中使用Redis

我们通过一个简单的需求，来实现一下在Nest项目中应用Redis。

通过Redis缓存用户的购物车信息，当用户查询购物车信息时，首先从Redis中查询，如果缓存为空，再去MySQL中查询。当用户在购物车中增加商品数量时，需要先将更新保存到MySQL中，并同时更新到Redis，以确保缓存数据的一致性。

### 项目创建

无论如何我们先建立项目：

```shell
nest n nest-redis -g -p pnpm
```

接下来，安装依赖包

```shell
pnpm add typeorm mysql2 @nestjs/typeorm redis -S
```

既然是购物车，先生成购物车模块

```shell
nest g res shopping-cart --no-spec
```

### Redis初始化

Redis通常会在多个模块中使用，为了更好的管理它，我们可以先创建一个redis模块，专门用来配置和导出Redis模块，其他模块可以通过依赖注入的方式使用它。甚至可以根据使用频率和需求，将模块定义为全局模块

```shell
nest g mo redis --flat
```

代码如下：

```typescript
import { Module } from '@nestjs/common';
import { createClient } from 'redis';

const createRedisClient = () => {
  return createClient({
    socket: {
      host: 'localhost',
      port: 6379,
    },
  }).connect();
};

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: createRedisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
```

其中，`createClient`方法负责提供的Redis配置信息来注册Redis客户端，通过`connect()`方法与Redis服务建立连接。通过providers提供服务，这样在购物车的service中，我们就可以直接注入了：

```typescript
@Injectable()
export class ShoppingCartService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  create(createShoppingCartDto: CreateShoppingCartDto) {
    return this.redisClient.set(
      'xxx',
      JSON.stringify(createShoppingCartDto),
    );
  }
}
```

`xxx`只是暂时命名，后面再统一处理

### ORM处理

在完善基础逻辑之前，数据库ORM相关内容需要先处理一下，首先当然还是在`app.module.ts`中初始化MySQL的连接

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nest_redis',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RedisModule,
    ShoppingCartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

稍微完善一下`ShoppingCart`实体

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  // 购物车数据,我们这里就简单保存一下购物车数量{count:1}就行了
  @Column('json')
  cartData: Record<string, number>;
}
```

这个实体是用来和数据库打交道的对象映射实体，我们还需要传递数据，因此，dto数据我们也顺便添加了

**create-shopping-cart.dto.ts**

```typescript
export class CreateShoppingCartDto {
  userId: number;
  cartData: Record<string, number>;
}
```

dto对象是专门用来传输数据的。

接下来在service中完善`create`、`findOne`和`update`方法，用来添加、查询和更新购物车信息，并且保持Redis与MySQL数据的一致性。其实也就是在更新MySQL数据的时候，Redis缓存同时更新。

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { RedisClientType } from 'redis';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShoppingCartService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  @InjectRepository(ShoppingCart)
  private shoppingCartRepository: Repository<ShoppingCart>;

  async create(createShoppingCartDto: CreateShoppingCartDto) {
    // 保存到mysql数据库中
    await this.shoppingCartRepository.save(createShoppingCartDto);
    // 保存到redis中

    await this.redisClient.set(
      `cart:${createShoppingCartDto.userId}`,
      JSON.stringify(createShoppingCartDto),
    );

    return {
      message: '添加购物车成功',
      success: true,
    };
  }

  async findOne(id: number) {
    // 先从redis中获取数据缓存，没有再到mysql中获取
    const data = await this.redisClient.get(`cart:${id}`);
    const cartEntity = data ? JSON.parse(data) : null;
    if (cartEntity) {
      return cartEntity;
    }

    return this.shoppingCartRepository.findOne({
      where: {
        userId: id,
      },
    });
  }

  async update(updateShoppingCartDto: UpdateShoppingCartDto) {
    const {
      userId,
      cartData: { count = 1 },
    } = updateShoppingCartDto;

    // 查询数据
    const cartEntity = await this.findOne(userId);

    const cart = cartEntity ? cartEntity.cartData : {};

    const quality = (cart.count || 0) + count;
    // 更新count
    cart.count = quality;

    // 更新mysql数据
    await this.shoppingCartRepository.update({ userId }, cartEntity);
    // 更新redis缓存
    await this.redisClient.set(`cart:${userId}`, JSON.stringify(cartEntity));

    return {
      message: '更新成功',
      success: true,
    };
  }
}
```

**注意：**由于在`ShoppingCart`模块中用到了`RedisModule`和`Repository`，所以，必须在`shopping-cart.module.ts`中引入相应的模块才行

**shopping-cart.module.ts**

```typescript
@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([ShoppingCart])],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
```

当然，controller上的代码我们稍作修改：

**shopping-cart.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  create(@Body() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.shoppingCartService.findOne(+userId);
  }

  @Patch()
  update(@Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(updateShoppingCartDto);
  }
}
```

### 测试代码

我们在APIFox中，添加一些测试数据

![APIFox 测试](/assets/73.png)

这样，在Redis和Mysql中都会有相应的数据

![Redis 数据](/assets/74.png)

![MySQL 数据](/assets/75.png)

我们可以多插入几条数据，方便一会查询修改

![插入多条数据](/assets/76.png)

接下来测试一下更新

![更新请求](/assets/77.png)

![Redis 更新结果](/assets/78.png)

![MySQL 更新结果](/assets/79.png)

### 设置缓存有效期

在实际开发中，Redis通常会设置缓存过期时间，以避免数据不一致或者缓存长时间未访问导致内存空间的浪费，比如，我们可以为更新设置缓存30秒的过期时间：

```diff
async update(updateShoppingCartDto: UpdateShoppingCartDto) {
  const {
    userId,
    cartData: { count = 1 },
  } = updateShoppingCartDto;

  // 查询数据
  const cartEntity = await this.findOne(userId);

  const cart = cartEntity ? cartEntity.cartData : {};

  const quality = (cart.count || 0) + count;
  // 更新count
  cart.count = quality;

  // 更新mysql数据
  await this.shoppingCartRepository.update({ userId }, cartEntity);
  // 更新redis缓存
	await this.redisClient.set(`cart:${userId}`, JSON.stringify(cartEntity), {
+    EX: 30,
	});

  return {
    message: '更新成功',
    success: true,
  };
}
```

现在再更新一条数据，就可以从GUI上很清楚的看到有效期(**TTL**)从30开始倒计时了

![TTL 倒计时](/assets/80.png)

当然，为什么要设置缓存有效期，有下面的理由：

- **释放内存空间：**如果长时间不被访问或者更新，这部分缓存可能会持续占用大量的空间不被释放，这在一定程度上会导致Redis频繁扩容。设置过期时间可以自动释放内存供其他缓存使用
- **保证数据的实时性：**当缓存对应的业务逻辑发生变更时，失效的缓存一直在内存中可能会导致业务逻辑错误，也就是我们常说的**"脏数据"**，这会影响系统的稳定性。设置自动过期可以保证缓存在一定时间是有效的，避免这种问题发生
- **保证数据的安全性：**过期时间其实是一种容错机制，缓存长时间存活在内存中，如果遇到内存泄漏或者恶意攻击，缓存中的隐私数据可能会被泄露
- **保证数据的一致性：**在并发场景或者缓存服务异常的时候，最新的缓存可能并未及时更新到内存中，此时获取到的旧缓存数据可能会因为数据不一致问题导致系统异常。设置缓存过期，可以保证缓存数据与数据库中的数据一致。

当然，设置缓存有效期并没有统一的最佳时长，这完全取决于具体的业务场景。通常可以根据下面的三种策略来选择：

- **短期缓存：**数据实时性要求高且频繁变动的情况下，可以设置较短的缓存时间，比如几分钟或者几个小时，以确保缓存数据及时与数据库同步，比如常见的新闻资讯推送、热点头条或者天气预报等等
- **中期缓存：**对于一些变动不频繁，但是要求一定实时性的数据，可以设置较长的缓存有效期，几小时或者几天，这样可以尽可能的减少数据库访问的压力。比如电商购物车、用户登录数据等等。
- **长期缓存：**对于相对稳定且变动少的数据，可以设置较长的有效期，几天或者几周。比如静态资源缓存、地理位置信息更新等等。
