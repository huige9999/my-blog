---
title: NestJS 教程 11：文件上传与 Multer 实战
date: 2026-02-28
description: 理清 FileInterceptor、存储策略、上传形态与文件校验的完整工程链路。
---

# NestJS 教程 11：文件上传与 Multer 实战

> 系列说明：本文是 NestJS 教程第 11 篇，重点讲清上传链路与配置边界，避免“能传但不可维护”。

NestJS（Express 平台）底层使用 multer 解析 `multipart/form-data`。Nest 提供的 `@UseInterceptors`、`@UploadedFile(s)`、`ParseFilePipe` 是在 multer 之上的工程化封装。

## 1. 上传链路

```text
multipart/form-data 请求
  ↓
Interceptor（内部调用 multer）
  ↓
文件保存（内存/磁盘，取决于 dest/storage）
  ↓
文件对象挂到 request
  ↓
@UploadedFile / @UploadedFiles 提取参数
  ↓
Pipe 校验（可选）
  ↓
返回响应
```

## 2. 单文件上传

```ts
@Post('upload1')
@UseInterceptors(FileInterceptor('file'))
uploadFile1(@UploadedFile() file: Express.Multer.File) {
  return {
    message: '上传成功',
    file: file.filename
  }
}
```

关键点：

- `FileInterceptor('file')` 的 `'file'` 必须与前端 form-data key 对应
- `@UploadedFile()` 负责从 request 里取 multer 解析结果，不负责“上传动作”

## 3. 存储策略：`dest` vs `storage`

### 3.1 快捷写法：`dest`

```ts
@UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
```

- 只指定目录
- 文件名通常由 multer 默认策略生成

### 3.2 完整写法：`storage`

```ts
import { diskStorage } from 'multer'
import { extname } from 'path'

@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  })
)
```

- 可控目录
- 可控命名规则（保后缀、加随机串、加业务标识）

## 4. 多文件上传三种形态

同字段多文件：

```ts
@UseInterceptors(FilesInterceptor('files', 3))
uploadFile2(@UploadedFiles() files: Express.Multer.File[]) {}
```

多字段分组：

```ts
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'files1', maxCount: 3 },
    { name: 'files2', maxCount: 3 }
  ])
)
uploadFile3(
  @UploadedFiles()
  files: { files1?: Express.Multer.File[]; files2?: Express.Multer.File[] }
) {}
```

任意字段：

```ts
@UseInterceptors(AnyFilesInterceptor({ storage }))
uploadFile4(@UploadedFiles() files: Express.Multer.File[]) {}
```

## 5. 文件校验：自定义 Pipe 与 `ParseFilePipe`

自定义 Pipe（自由度高）：

```ts
@Injectable()
export class FileValidationPipePipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (value.size > 10 * 1024) {
      throw new HttpException('文件上传大小不能超过10K', HttpStatus.BAD_REQUEST)
    }
    return value
  }
}
```

内置方案（更标准）：`ParseFilePipe` + validators

- `MaxFileSizeValidator`
- `FileTypeValidator`
- 或自定义 `FileValidator`

## 6. 自定义 `FileValidator`

```ts
import { FileValidator } from '@nestjs/common'

export class MyFileValidator extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    if (file.size > 10 * 1024) return false
    if (file.mimetype !== 'image/jpeg') return false
    return true
  }

  buildErrorMessage(file: Express.Multer.File): string {
    if (file.size > 10 * 1024) return `文件 --- ${file.originalname} --- 太大,超出10K`
    if (file.mimetype !== 'image/jpeg') return `文件 --- ${file.originalname} --- 类型不正确,只能上传jpeg图片`
    return '文件不合法'
  }
}
```

配合 `ParseFilePipe`：

```ts
@UploadedFile(
  new ParseFilePipe({
    validators: [new MyFileValidator({})]
  })
)
file: Express.Multer.File
```

## 7. 两套 storage 为什么同时存在

常见配置：

- 全局默认：`MulterModule.register({ storage })`
- 局部覆写：`FileInterceptor(..., { storage })`

结论：局部配置优先于全局默认。

另外，局部既能用 `dest`（快捷）也能用 `storage`（可控），本质都是 multer options。

## 小结

把上传拆成三件事就不会乱：

1. 解析与保存：Interceptor（multer）
2. 参数提取：`@UploadedFile(s)`
3. 合法性校验：Pipe（`ParseFilePipe` 或自定义）

