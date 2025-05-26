import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function Settings() {
  return (
    <form method="post">
      <Heading>Settings</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Default Text Size</Subheading>
          <Text>Choose the default text size for the application interface.</Text>
        </div>
        <div>
          <Select aria-label="Default Text Size" name="textSize" defaultValue="normal">
            <option value="tiny">Tiny (12px)</option>
            <option value="small">Small (14px)</option>
            <option value="normal">Normal (16px)</option>
            <option value="large">Large (18px)</option>
            <option value="extra-large">Extra Large (20px)</option>
            <option value="huge">Huge (22px)</option>
            <option value="massive">Massive (24px)</option>
          </Select>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Format</Subheading>
          <Text>Set your preferred date and time formatting preferences.</Text>
        </div>
        <Fieldset>
          <FieldGroup>
            <Field>
              <Label>Date Format</Label>
              <Select aria-label="Date Format" name="dateFormat" defaultValue="MM/DD/YYYY">
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                <option value="DD MMM YYYY">DD MMM YYYY (31 Dec 2024)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2024)</option>
              </Select>
            </Field>
            <Field>
              <Label>Time Format</Label>
              <Select aria-label="Time Format" name="timeFormat" defaultValue="12">
                <option value="12">12-hour (2:30 PM)</option>
                <option value="24">24-hour (14:30)</option>
              </Select>
            </Field>
          </FieldGroup>
        </Fieldset>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>API Keys</Subheading>
          <Text>Configure API keys for AI services. Keys are encrypted and stored securely.</Text>
        </div>
        <div className="space-y-4">
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>OpenAI API Key</Label>
                <Input 
                  type="password" 
                  aria-label="OpenAI API Key" 
                  name="openaiApiKey" 
                  placeholder="sk-..." 
                />
                <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Used for ChatGPT and GPT-4 integrations. Get your key from{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                    OpenAI Platform
                  </a>
                </Text>
              </Field>
              <Field>
                <Label>Anthropic API Key</Label>
                <Input 
                  type="password" 
                  aria-label="Anthropic API Key" 
                  name="anthropicApiKey" 
                  placeholder="sk-ant-..." 
                />
                <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Used for Claude integrations. Get your key from{' '}
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                    Anthropic Console
                  </a>
                </Text>
              </Field>
            </FieldGroup>
          </Fieldset>
          <CheckboxField>
            <Checkbox name="enableAiFeatures" defaultChecked />
            <Label>Enable AI-powered features</Label>
          </CheckboxField>
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}
