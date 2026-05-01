const fs = require('fs');

const overviewFile = 'C:\\Users\\barma\\.gemini\\antigravity\\brain\\2b2fde6d-dfde-4154-83ea-6d4d9a3b9233\\.system_generated\\logs\\overview.txt';

if (fs.existsSync(overviewFile)) {
    const lines = fs.readFileSync(overviewFile, 'utf8').split('\n');
    let homeCode = "";
    
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                for (const call of data.tool_calls) {
                    if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('Home.jsx')) {
                        homeCode = call.args.CodeContent;
                    }
                    if (call.name === 'replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.includes('Home.jsx')) {
                        // Very naive apply
                        homeCode = homeCode.replace(call.args.TargetContent, call.args.ReplacementContent);
                    }
                }
            }
        } catch (e) {}
    }
    fs.writeFileSync('recovered_Home.jsx', homeCode);
    console.log("Recovered Home.jsx!");
} else {
    console.log("Log file not found");
}
