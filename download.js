const express = require('express');
const app = express();

app.get('/download', (req, res) => {
    // 获取Unity下载链接参数
    const inputLink = req.query.url.trim().toLowerCase();
    const prefix = "unityhub://";
    let fileId = "";
    let version = "";

    if (inputLink.startsWith(prefix)) {
        const linkParts = inputLink.substring(prefix.length).split("/");
        fileId = linkParts[1];
        version = linkParts[0];
    } else {
        return res.status(400).json({ error: "UnityHub Url Error" });
    }

    // 生成下载链接
    const windows = `https://download.unity3d.com/download_unity/${fileId}/Windows64EditorInstaller/UnitySetup64-${version}.exe`;
    const mac = `https://download.unity3d.com/download_unity/${fileId}/MacEditorInstaller/Unity-${version}.pkg`;
    const macarm = `https://download.unity3d.com/download_unity/${fileId}/MacEditorInstallerArm64/Unity-${version}.pkg`;
    const linux = `https://download.unity3d.com/download_unity/${fileId}/LinuxEditorInstaller/Unity-${version}.tar.xz`;

    res.json({ windows, mac, macarm, linux });
});

app.listen(3000, () => {
    console.log('Download Sever Running');
});