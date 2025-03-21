'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChainTokenSelect from '@/components/ChainTokenSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Chain, Token, SUPPORTED_CHAINS, TOKENS } from '@/lib/constants';

interface LiquidityFormProps {
  onSubmit: (data: {
    action: 'add' | 'remove';
    chain: Chain;
    token: Token;
    amount: string;
  }) => void;
}

export function LiquidityForm({ onSubmit }: LiquidityFormProps) {
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[SUPPORTED_CHAINS[0].id][0]);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ action, chain: selectedChain, token: selectedToken, amount });
  };

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Manage Liquidity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={action} onValueChange={(v) => setAction(v as 'add' | 'remove')}>
            <TabsList className="grid w-full grid-cols-2 bg-[#0A0F1C] border border-[#1F2937]">
              <TabsTrigger
                value="add"
                className="flex items-center gap-2 data-[state=active]:bg-[#1F2937] data-[state=active]:text-[#E5E7EB] text-[#9CA3AF]"
              >
                <PlusCircle className="h-4 w-4" />
                Add Liquidity
              </TabsTrigger>
              <TabsTrigger
                value="remove"
                className="flex items-center gap-2 data-[state=active]:bg-[#1F2937] data-[state=active]:text-[#E5E7EB] text-[#9CA3AF]"
              >
                <MinusCircle className="h-4 w-4" />
                Remove Liquidity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E5E7EB]">Select Chain & Token</Label>
                  <ChainTokenSelect
                    label="From"
                    selectedChain={selectedChain}
                    availableChains={SUPPORTED_CHAINS}
                    selectedToken={selectedToken}
                    availableTokens={TOKENS[selectedChain.id]}
                    onChainChange={setSelectedChain}
                    onTokenChange={setSelectedToken}
                  />
                </div>

                <div>
                  <Label className="text-[#E5E7EB]">Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#0A0F1C] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#374151]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="remove" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E5E7EB]">Select Position</Label>
                  <ChainTokenSelect
                    label="From"
                    selectedChain={selectedChain}
                    availableChains={SUPPORTED_CHAINS}
                    selectedToken={selectedToken}
                    availableTokens={TOKENS[selectedChain.id]}
                    onChainChange={setSelectedChain}
                    onTokenChange={setSelectedToken}
                  />
                </div>

                <div>
                  <Label className="text-[#E5E7EB]">Amount to Remove</Label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#0A0F1C] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#374151]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            {action === 'add' ? 'Add Liquidity' : 'Remove Liquidity'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}