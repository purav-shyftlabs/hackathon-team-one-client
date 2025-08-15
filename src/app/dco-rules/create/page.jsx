"use client";
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Input, Tag, Divider, Progress, Avatar } from 'antd';
import { 
  Plus, 
  X, 
  Trash2, 
  User, 
  Download, 
  List, 
  Grid3X3, 
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateDcoRules = () => {
  const [ruleName, setRuleName] = useState("Smart CTR Optimization Rule");
  const [selectedCreatives, setSelectedCreatives] = useState([
    "Summer Collection 2025",
    "Holiday Special 2025"
  ]);
  const [conditions, setConditions] = useState([
    {
      id: 1,
      type: "performance",
      description: "If CTR drops below 2% → Generate new creative with offer details."
    },
    {
      id: 2,
      type: "location",
      description: "Always add location traits in template."
    },
    {
      id: 3,
      type: "targeting",
      description: "If location is Toronto → Show high value products."
    }
  ]);

  const handleRemoveCreative = (creativeToRemove) => {
    setSelectedCreatives(selectedCreatives.filter(creative => creative !== creativeToRemove));
  };

  const handleAddCreative = () => {
    const newCreative = `Creative ${selectedCreatives.length + 1}`;
    setSelectedCreatives([...selectedCreatives, newCreative]);
  };

  const handleRemoveCondition = (conditionId) => {
    setConditions(conditions.filter(condition => condition.id !== conditionId));
  };

  const handleAddCondition = () => {
    const newCondition = {
      id: conditions.length + 1,
      type: "new",
      description: "New condition..."
    };
    setConditions([...conditions, newCondition]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <Title level={2} className="mb-1">Create DCO Rules</Title>
            <Text type="secondary">Manage dynamic creative optimization rules</Text>
          </div>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rule Configuration */}
            <Card className="shadow-sm">
              <Title level={4} className="mb-4">Rule Configuration</Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name
                  </label>
                  <Input
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Enter rule name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creatives Running on This Rule
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCreatives.map((creative, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => handleRemoveCreative(creative)}
                        className="bg-gray-100 border-gray-200 text-gray-700 px-3 py-1"
                      >
                        {creative}
                      </Tag>
                    ))}
                  </div>
                  <Button 
                    type="dashed" 
                    icon={<Plus className="w-4 h-4" />}
                    onClick={handleAddCreative}
                    className="border-gray-300 text-gray-600"
                  >
                    + Add Creative
                  </Button>
                </div>
              </div>
            </Card>

            {/* Rule Conditions */}
            <Card className="shadow-sm mt-4!">
              <Title level={4} className="mb-4">Rule Conditions</Title>
              
              <div className="space-y-3">
                {conditions.map((condition) => (
                  <div key={condition.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <Text className="text-sm text-gray-700">{condition.description}</Text>
                    </div>
                    <Button
                      type="text"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleRemoveCondition(condition.id)}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </div>
                ))}
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  onClick={handleAddCondition}
                >
                  <Plus className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <Text className="text-sm text-gray-500">+ Add New Condition</Text>
                </div>
              </div>
            </Card>

            {/* Expected Results */}
            <Card className="shadow-sm mt-4!">
              <Title level={4} className="mb-4">Expected Results</Title>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">+15%</div>
                  <Text className="text-sm text-gray-600">CTR Improvement</Text>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">+22%</div>
                  <Text className="text-sm text-gray-600">Conversion Rate</Text>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">-8%</div>
                  <Text className="text-sm text-gray-600">CPA Reduction</Text>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
                <Link href="/dco-rules">
              <Button 
                type="primary" 
                size="large"
                className="bg-black! border-black hover:bg-black/80 hover:text-white!"
                >
                Save Rule
              </Button>
                  </Link>
              <Button 
                size="large"
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right Section - Sidebar */}
          <div className="space-y-6">
            {/* Rule Information */}
            <Card className="shadow-sm">
              <Title level={4} className="mb-4">Rule Information</Title>
              
              <div className="space-y-4">
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">CREATED BY</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar size="small" icon={<User className="w-3 h-3" />} />
                    <Text className="text-sm">Sarah Johnson</Text>
                  </div>
                </div>
                
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">CREATED ON</Text>
                  <Text className="text-sm block mt-1">August 12, 2025</Text>
                </div>
                
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">LAST MODIFIED</Text>
                  <Text className="text-sm block mt-1">August 15, 2025 at 3:24 PM</Text>
                </div>
                
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">RULE ID</Text>
                  <Text className="text-sm block mt-1">DCO-R-24892</Text>
                </div>
              </div>
            </Card>

            {/* Status */}
            <Card className="shadow-sm mt-4!">
              <div className="flex items-center justify-between">
                <Text className="text-sm font-medium text-gray-700">STATUS</Text>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <Text className="text-sm text-green-600 font-medium">Active</Text>
                </div>
              </div>
            </Card>

            {/* Performance */}
            <Card className="shadow-sm mt-4!">
              <Title level={4} className="mb-4">Performance</Title>
              
              <div className="space-y-4">
                <div>
                  <Text className="text-sm text-gray-600">Rules Triggered</Text>
                  <Text className="text-2xl font-bold text-gray-900">142</Text>
                </div>
                
                <div>
                  <Text className="text-sm text-gray-600">Success Rate</Text>
                  <div className="flex items-center gap-2">
                    <Text className="text-2xl font-bold text-gray-900">87%</Text>
                    <Progress percent={87} size="small" showInfo={false} className="flex-1" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Text type="secondary">© 2025 CreativePro. All rights reserved.</Text>
          
          <div className="flex items-center gap-6">
            <div className="flex space-x-4">
              <Text type="secondary" className="cursor-pointer hover:text-gray-600">Terms of Service</Text>
              <Text type="secondary" className="cursor-pointer hover:text-gray-600">Privacy Policy</Text>
              <Text type="secondary" className="cursor-pointer hover:text-gray-600">Help Center</Text>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                type="text" 
                size="small" 
                icon={<Download className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<List className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<Grid3X3 className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<MoreHorizontal className="w-4 h-4" />}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDcoRules;