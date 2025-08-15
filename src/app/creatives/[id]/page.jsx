"use client";
import { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Progress, Tabs, Statistic, Row, Col, Typography, Divider } from 'antd';
import { EyeOutlined, FilterOutlined, ExportOutlined, ArrowUpOutlined, ArrowDownOutlined, BulbOutlined, SaveOutlined, LeftOutlined } from '@ant-design/icons';
import { FacebookIcon, InstagramIcon } from 'lucide-react';
import api from '@/conf/api';

const { Title, Text, Paragraph } = Typography;

const CreativePerformance = ({ params }) => {
  const [creativeData, setCreativeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Platform icons mapping
  const platformIcons = {
    facebook: <FacebookIcon className="w-5 h-5" />,
    instagram: <InstagramIcon className="w-5 h-5" />,
    google: <span className="text-lg">🔍</span>,
    pinterest: <span className="text-lg">📌</span>,
    tiktok: <span className="text-lg">🎵</span>,
    linkedin: <span className="text-lg">💼</span>,
    twitter: <span className="text-lg">🐦</span>,
    snapchat: <span className="text-lg">👻</span>
  };

  // Platform names mapping
  const platformNames = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    google: 'Google Ads',
    pinterest: 'Pinterest',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    snapchat: 'Snapchat'
  };

  // Platform descriptions
  const platformDescriptions = {
    facebook: 'Feed, Stories, Carousel',
    instagram: 'Feed, Stories, Reels',
    google: 'Display, Banner, Responsive'
  };

  useEffect(() => {
    const fetchCreativeData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/creative/${params.id}`);
        setCreativeData(response.data);
      } catch (error) {
        console.error('Error fetching creative data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreativeData();
  }, [params.id]);

  // Generate table data from image_data
  const generateTableData = () => {
    if (!creativeData?.image_data) return [];
    
    const data = [];
    Object.entries(creativeData.image_data).forEach(([platform, sizes]) => {
      Object.entries(sizes).forEach(([size, imageUrl]) => {
        const [width, height] = size.split('x').map(Number);
        const ratio = width / height;
        const ratioText = ratio === 1 ? '1:1' : ratio > 1 ? '16:9' : '9:16';
        
        // Generate performance data
        const impressions = Math.floor(Math.random() * 50000) + 10000;
        const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.02));
        const adSpend = Math.floor(Math.random() * 500) + 100;
        const ctr = ((clicks / impressions) * 100).toFixed(2);
        const roas = (Math.random() * 2 + 1).toFixed(1);
        const uplift = (Math.random() * 40 - 10).toFixed(0);
        
        data.push({
          key: `${platform}-${size}`,
          platform: platform,
          placement: `${platformNames[platform]} ${getPlacementName(size)}`,
          size: `${ratioText} (${size})`,
          status: getRandomStatus(),
          preview: imageUrl,
          dcoVariations: `${Math.floor(Math.random() * 3) + 1}/3`,
          dcoStatus: getRandomDCOStatus(),
          impressions: impressions.toLocaleString(),
          clicks: clicks.toLocaleString(),
          adSpend: `$${adSpend}`,
          ctr: `${ctr}%`,
          roas: `${roas}x`,
          uplift: `${uplift >= 0 ? '↑' : '↓'}${Math.abs(uplift)}%`
        });
      });
    });
    
    return data;
  };

  const getPlacementName = (size) => {
    const [width, height] = size.split('x').map(Number);
    if (width === height) return 'Feed';
    if (width > height) return 'Banner';
    return 'Stories';
  };

  const getRandomStatus = () => {
    const statuses = ['Ready', 'Pending', 'Failed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomDCOStatus = () => {
    const statuses = ['Active', 'Processing', 'Inactive'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Calculate performance summary
  const calculatePerformanceSummary = () => {
    const data = generateTableData();
    const totalImpressions = data.reduce((sum, item) => sum + parseInt(item.impressions.replace(/,/g, '')), 0);
    const totalClicks = data.reduce((sum, item) => sum + parseInt(item.clicks.replace(/,/g, '')), 0);
    const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);
    const avgROAS = (data.reduce((sum, item) => sum + parseFloat(item.roas), 0) / data.length).toFixed(1);
    
    return {
      totalImpressions: totalImpressions.toLocaleString(),
      totalClicks: totalClicks.toLocaleString(),
      avgCTR: `${avgCTR}%`,
      avgROAS: `${avgROAS}x`
    };
  };

  // Table columns
  const columns = [
    {
      title: 'PLATFORM',
      dataIndex: 'placement',
      key: 'placement',
      render: (text, record) => (
        <Space>
          {platformIcons[record.platform]}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'SIZE',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        switch (status) {
          case 'Ready': color = 'green'; break;
          case 'Pending': color = 'orange'; break;
          case 'Failed': color = 'red'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'PREVIEW',
      dataIndex: 'preview',
      key: 'preview',
      render: (imageUrl, record) => {
        // Try to find a 1:1 image for this platform
        const platformData = creativeData?.image_data?.[record.platform];
        let previewImage = null;
        
        if (platformData) {
          // Look for 1:1 ratio images first (1080x1080, 1200x1200, etc.)
          const oneToOneImages = Object.entries(platformData).filter(([size]) => {
            const [width, height] = size.split('x').map(Number);
            return width === height;
          });
          
          if (oneToOneImages.length > 0) {
            previewImage = oneToOneImages[0][1]; // Take the first 1:1 image
          } else {
            // If no 1:1, take the first available image
            previewImage = Object.values(platformData)[0];
          }
        }
        
        if (previewImage) {
          return (
            <div className="w-12 h-8 bg-gray-100 rounded overflow-hidden">
              <img 
                src={previewImage} 
                alt={`${record.platform} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center" style={{ display: 'none' }}>
                <EyeOutlined className="text-gray-500 text-xs" />
              </div>
            </div>
          );
        }
        
        return (
          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
            <EyeOutlined className="text-gray-500 text-xs" />
          </div>
        );
      },
    },
    {
      title: 'DCO VARIATIONS',
      dataIndex: 'dcoVariations',
      key: 'dcoVariations',
      render: (variations) => (
        <Progress 
          percent={parseInt(variations.split('/')[0]) / 3 * 100} 
          size="small" 
          showInfo={false}
        />
      ),
    },
    {
      title: 'DCO STATUS',
      dataIndex: 'dcoStatus',
      key: 'dcoStatus',
      render: (status) => {
        let color = 'default';
        switch (status) {
          case 'Active': color = 'green'; break;
          case 'Processing': color = 'blue'; break;
          case 'Inactive': color = 'red'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'IMPRESSIONS',
      dataIndex: 'impressions',
      key: 'impressions',
    },
    {
      title: 'CLICKS',
      dataIndex: 'clicks',
      key: 'clicks',
    },
    {
      title: 'AD SPEND',
      dataIndex: 'adSpend',
      key: 'adSpend',
    },
    {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
    },
    {
      title: 'ROAS',
      dataIndex: 'roas',
      key: 'roas',
    },
    {
      title: 'UPLIFT',
      dataIndex: 'uplift',
      key: 'uplift',
      render: (uplift) => {
        const isPositive = uplift.includes('↑');
        const color = isPositive ? 'green' : 'red';
        return <span style={{ color }}>{uplift}</span>;
      },
    },
  ];

  // Tab items
  const tabItems = [
    {
      key: 'all',
      label: `All (${generateTableData().length})`,
    },
    {
      key: 'facebook',
      label: `Facebook (${generateTableData().filter(item => item.platform === 'facebook').length})`,
    },
    {
      key: 'instagram',
      label: `Instagram (${generateTableData().filter(item => item.platform === 'instagram').length})`,
    },
    {
      key: 'google',
      label: `Google Ads (${generateTableData().filter(item => item.platform === 'google').length})`,
    },
  ];

  // Filter table data based on active tab
  const filteredData = activeTab === 'all' 
    ? generateTableData() 
    : generateTableData().filter(item => item.platform === activeTab);

  const performanceSummary = calculatePerformanceSummary();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!creativeData) {
    return <div className="flex justify-center items-center h-64">Creative not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">Creative Performance</Title>
        <div className="flex items-center gap-4">
          <Text type="secondary">Last saved: 10:42 AM</Text>
          <Button className='bg-black text-white hover:bg-black! hover:text-white! hover:border-black!' icon={<SaveOutlined />}>Save</Button>
        </div>
      </div>

      {/* Creative Name Section */}
      <Card className="mb-6">
        <div className="mb-4">
          <Title level={4}>Creative Name</Title>
          <Text type="secondary">Your base creative that will be adapted to different platforms and sizes.</Text>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {creativeData.creative_s3_url ? (
              <img 
                src={creativeData.creative_s3_url} 
                alt="Creative Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center" style={{ display: creativeData.creative_s3_url ? 'none' : 'flex' }}>
              <EyeOutlined className="text-gray-500 text-xl" />
            </div>
          </div>
          <div>
            <Title level={5} className="mb-1">{creativeData.creative_title}</Title>
            <Text type="secondary">
              {creativeData.format_type} Creative - 1:1 Format - Created {new Date(creativeData.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
          </div>
        </div>
      </Card>

      {/* Selected Platforms Section */}
      <Card className="mb-6 mt-8!">
        <div className="mb-4">
          <Title level={4}>Selected Platforms</Title>
          <Text type="secondary">Platforms selected for your ad campaign.</Text>
        </div>
        <div className="flex gap-4">
          {creativeData.selected_platforms?.map((platform, index) => (
            <Card 
              key={platform} 
              size="small" 
              className={`w-32 text-center ${index === 0 ? 'border-black' : ''}`}
            >
              <div className="mb-2">{platformIcons[platform]}</div>
              <div className="font-medium">{platformNames[platform]}</div>
              <div className="text-xs text-gray-500">{platformDescriptions[platform]}</div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Creative Sizes Section */}
      <Card className="mb-6 mt-8!">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={4}>Creative Sizes</Title>
            <Text type="secondary">Based on your platform selection, these creative sizes will be generated.</Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems}
          className="mb-4"
        />
        
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 6,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} creatives`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Performance Summary Section */}
      <Card className="mb-6 mt-10!">
        <div className="mb-4">
          <Title level={4}>Performance Summary</Title>
          <Text type="secondary">Overview of your creative performance metrics across all platforms.</Text>
        </div>
        
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Statistic
              title="Total Impressions"
              value={performanceSummary.totalImpressions}
              suffix={<span className="text-green-500 text-sm">↑12.5% from baseline</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Clicks"
              value={performanceSummary.totalClicks}
              suffix={<span className="text-green-500 text-sm">↑8.3% from baseline</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average CTR"
              value={performanceSummary.avgCTR}
              suffix={<span className="text-green-500 text-sm">↑0.8% from baseline</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average ROAS"
              value={performanceSummary.avgROAS}
              suffix={<span className="text-green-500 text-sm">↑15.2% from baseline</span>}
            />
          </Col>
        </Row>

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <BulbOutlined className="text-blue-500 text-lg mt-1" />
            <div>
              <Title level={5} className="mb-2">Optimization Insight</Title>
              <Text>
                Your DCO variations are showing a 15.2% higher ROAS compared to standard creatives. 
                Consider increasing budget allocation to top-performing platforms like Instagram Feed (2.8x ROAS) for maximum results.
              </Text>
            </div>
          </div>
        </Card>
      </Card>

      {/* Footer Actions */}
      {/* <div className="flex justify-between items-center">
        <Button icon={<LeftOutlined />}>Back</Button>
        <Space>
          <Button>Save Draft</Button>
          <Button type="primary">Continue to Variants</Button>
        </Space>
      </div> */}
    </div>
  );
};

export default CreativePerformance;
