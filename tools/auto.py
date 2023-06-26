with open('input.txt', 'r') as f: #假设需要处理的文本文件为file.txt
    lines = f.readlines() #读取文件中的所有内容
    for i, line in enumerate(lines): #循环遍历所有行
        new_line = '(' + line[:-1] + ')\n' #将每行文本前面加上[]，后尾加上)
        lines[i] = new_line #替换原来的行内容
with open('1.txt', 'w') as f: #将处理后的内容写入文件
    f.writelines(lines)

import re

versions = []

# 打开文件
with open("1.txt", "r") as f:
    lines = f.readlines()
    for line in lines:
        # 使用正则表达式提取版本号
        match = re.search(r"(\d+\.\d+\.\d+f\d+)", line)
        if match:
            version = match.group()
            versions.append(f"[{version}]{line.strip()}")

# 将结果保存到文件
with open("output.txt", "w") as f:
    for v in versions:
        f.write(v + "\n")