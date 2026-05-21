---
id: 2
title: "Python 数据处理实战：从 Pandas 到自动化脚本"
date: "2026-04-15"
summary: "记录在数据分析项目中使用 Python 处理数据的实践经验..."
tags: ["Python", "数据处理", "教程"]
---

## 背景

在一个数据分析项目中，需要处理来自多个数据源的原始数据。数据量大约在百万级别，对处理效率有一定要求。

### 数据源

- CSV 文件：每日导出的业务数据（~50MB/天）
- Excel 报表：月度汇总数据
- API 接口：实时数据流

## Pandas 核心操作

### 数据读取

```python
import pandas as pd

# 读取 CSV
df = pd.read_csv('data.csv', parse_dates=['date'])

# 读取 Excel
df_excel = pd.read_excel('report.xlsx', sheet_name='Sheet1')
```

### 数据清洗

数据清洗是最耗时的环节。常见问题包括缺失值、异常值、格式不一致等。

```python
# 处理缺失值
df.fillna({'name': 'Unknown', 'score': 0}, inplace=True)

# 去除重复行
df.drop_duplicates(subset=['id'], inplace=True)

# 类型转换
df['date'] = pd.to_datetime(df['date'])
```

## 性能优化

### 向量化操作

避免使用 `apply()` 和循环，尽可能使用向量化操作：

```python
# 慢
df['total'] = df.apply(lambda row: row['price'] * row['qty'], axis=1)

# 快
df['total'] = df['price'] * df['qty']
```

### 分块读取

对于超大文件，使用分块读取：

```python
chunk_size = 100000
for chunk in pd.read_csv('large.csv', chunksize=chunk_size):
    # 处理每个 chunk
    process(chunk)
```

## 自动化脚本

最终将这些操作封装成一个 CLI 工具：

- 输入：数据文件路径和配置文件
- 处理：自动执行清洗、转换、聚合
- 输出：清洗后的数据和可视化报告

### 小结

Python + Pandas 是数据处理的高效组合。关键是理解数据的特点，选择合适的操作方法，并在代码可读性和性能之间找到平衡。
