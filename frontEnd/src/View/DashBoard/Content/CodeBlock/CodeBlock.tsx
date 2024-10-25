import { CodeBlock } from 'react-code-block';

// https://react-code-block.netlify.app/usage#copy-code-to-clipboard-button

const QueryCodeBlock = ({
    className,
    autoGeneratedFluxCode
}: {
    className: string
    autoGeneratedFluxCode: string
}) => {
    return (
        <CodeBlock code={autoGeneratedFluxCode} language="flux">
            <CodeBlock.Code className={className}>
                <CodeBlock.LineContent>
                    <CodeBlock.Token />
                </CodeBlock.LineContent>
            </CodeBlock.Code>
        </CodeBlock>
    )
}

export default QueryCodeBlock 