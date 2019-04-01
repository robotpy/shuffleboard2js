
<basic-subsystem>
    <div class="subsystem-container">
        <p>Default command: {opts.table['.default'] || 'None'}</p>
        <p>Current command: {opts.table['.command'] || 'None'}</p>
    </div>

    <style>

        .subsystem-container {
            padding: 10px;
        }

        p {
            margin-bottom: 10px;
            text-align: left;
            font-weight: normal;
        }
    </style>
</basic-subsystem>