"use client";
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Divider, Dropdown } from 'antd';
import { 
  Plus, 
  PlayCircle, 
  Save, 
  TestTube,
  Image,
  RotateCcw,
  Minus,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

const { Title, Text } = Typography;

const DcoRules = () => {
  const [creativeBlocks, setCreativeBlocks] = useState([
    {
      id: 1,
      title: "Summer Collection 2025",
      creativeId: "CR-001",
      condition: "CTR < 2%",
      dcoVariations: 4,
      type: "condition"
    },
    {
      id: 2,
      title: "Holiday Special 2025",
      creativeId: "CR-002",
      condition: "Location = Toronto",
      dcoVariations: 6,
      type: "condition"
    },
    {
      id: 3,
      title: "Fallback Creative",
      creativeId: "CR-004",
      outputAction: "Generate New with Offers",
      dcoVariations: 12,
      type: "output"
    },
    {
      id: 4,
      title: "Product Showcase",
      creativeId: "CR-003",
      outputAction: "Show High Value Products",
      dcoVariations: 8,
      type: "output"
    }
  ]);

  const handleAddCreativeBlock = () => {
    const newBlock = {
      id: creativeBlocks.length + 1,
      title: `New Creative ${creativeBlocks.length + 1}`,
      creativeId: `CR-${String(creativeBlocks.length + 1).padStart(3, '0')}`,
      condition: "Select condition...",
      dcoVariations: Math.floor(Math.random() * 10) + 1,
      type: "condition"
    };
    setCreativeBlocks([...creativeBlocks, newBlock]);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <Title level={2} className="mb-1">DCO Rules</Title>
            <Text type="secondary">Manage dynamic creative optimization rules</Text>
          </div>
          <Button 
            type="primary" 
            icon={<Plus className="w-4 h-4" />}
            className="bg-black border-black hover:bg-gray-800"
          >
            + Create New Rule
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Flow Controls */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <Space>
                <Button 
                  type="primary" 
                  icon={<Save className="w-4 h-4" />}
                  className="bg-black border-black hover:bg-gray-800"
                >
                  Save Flow
                </Button>
                <Button 
                  icon={<TestTube className="w-4 h-4" />}
                  className="border-gray-300"
                >
                  Test Flow
                </Button>
              </Space>
              <div className="text-sm text-gray-500">
                Flow ID: DCO-F-24892 | Last saved: 2 minutes ago
              </div>
            </div>
            
            {/* Start Button */}
            <div className="flex justify-center mb-6">
              <Button 
                type="primary" 
                icon={<PlayCircle className="w-5 h-5" />}
                size="large"
                className="bg-black border-black hover:bg-gray-800"
              >
                Start
              </Button>
            </div>
          </div>
        </div>

        {/* Flow Area */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[600px] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Creative Blocks */}
            {creativeBlocks.map((block, index) => (
              <div key={block.id} className="relative">
                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <Image className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Title level={5} className="mb-1 truncate">{block.title}</Title>
                      <Text type="secondary" className="text-xs">Creative ID: {block.creativeId}</Text>
                      
                      {block.type === "condition" ? (
                        <Dropdown menu={{ items: [
                          { key: 'ctr', label: 'CTR < 2%' },
                          { key: 'location', label: 'Location = Toronto' },
                          { key: 'time', label: 'Time of Day = Morning' },
                          { key: 'device', label: 'Device = Mobile' }
                        ]}} trigger={['click']}>
                          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
                            <div className="flex justify-between items-center">
                              <Text className="text-sm">{block.condition}</Text>
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </Dropdown>
                      ) : (
                        <Dropdown menu={{ items: [
                          { key: 'generate', label: 'Generate New with Offers' },
                          { key: 'show', label: 'Show High Value Products' },
                          { key: 'personalize', label: 'Personalize Content' },
                          { key: 'optimize', label: 'Optimize for Conversion' }
                        ]}} trigger={['click']}>
                          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
                            <div className="flex justify-between items-center">
                              <Text className="text-sm">{block.outputAction}</Text>
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </Dropdown>
                      )}
                      
                      <div className="mt-3">
                        <Text type="secondary" className="text-xs">DCO Variations: {block.dcoVariations}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Flow Arrow */}
                {index < creativeBlocks.length - 1 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                      <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Creative Block */}
            <div className="relative">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                onClick={handleAddCreativeBlock}
              >
                <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-500">+ Add Creative Block</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Text type="secondary">© 2025</Text>
            <div className="flex items-center space-x-2">
              <Button 
                type="text" 
                size="small" 
                icon={<RotateCcw className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<Minus className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
              <div className="w-20 h-1 bg-gray-200 rounded-full">
                <div className="w-1/2 h-full bg-gray-400 rounded-full"></div>
              </div>
              <Button 
                type="text" 
                size="small" 
                icon={<Plus className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Text type="secondary" className="cursor-pointer hover:text-gray-600">Terms of Service</Text>
            <Text type="secondary" className="cursor-pointer hover:text-gray-600">Privacy Policy</Text>
            <Text type="secondary" className="cursor-pointer hover:text-gray-600">Help Center</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DcoRules;