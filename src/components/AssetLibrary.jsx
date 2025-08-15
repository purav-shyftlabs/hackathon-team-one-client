"use client";
import { Dropdown, Table, Tag, Space, Button, Pagination, Input, Select } from 'antd';
import { ChevronDownIcon, FilterIcon, Grid, List, PlusIcon, SearchIcon, Eye, Pencil, Ellipsis } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { FacebookIcon, InstagramIcon } from 'lucide-react';
import { CheckSquareOutlined } from '@ant-design/icons';
import api from '@/conf/api';

const AssetLibrary = () => {
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false
  });
  const [filters, setFilters] = useState({
    platform_filter: '',
    limit: 10,
    offset: 0,
    search: ''
  });
  const [searchValue, setSearchValue] = useState('');

  // Platform icons mapping
  const platformIcons = {
    facebook: <FacebookIcon className="w-4 h-4" />,
    instagram: <InstagramIcon className="w-4 h-4" />,
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

  const fetchCreatives = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: filters.limit.toString(),
        offset: filters.offset.toString(),
        ...(filters.platform_filter && { platform_filter: filters.platform_filter }),
        ...(filters.search && { search_query: filters.search })
      });

      const response = await api.get(`/creatives?${params}`);
      setCreatives(response.data.creatives);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching creatives:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchValue,
        offset: 0 // Reset to first page when searching
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    fetchCreatives();
  }, [filters]);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle search on Enter key
  const handleSearchPressEnter = () => {
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      offset: 0
    }));
  };

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    const newOffset = (page - 1) * pageSize;
    setFilters(prev => ({
      ...prev,
      offset: newOffset,
      limit: pageSize
    }));
  };

  // Handle platform filter change
  const handlePlatformFilterChange = (platform) => {
    setFilters(prev => ({
      ...prev,
      platform_filter: platform === 'all' ? '' : platform,
      offset: 0 // Reset to first page when filtering
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize) => {
    setFilters(prev => ({
      ...prev,
      limit: pageSize,
      offset: 0 // Reset to first page when changing page size
    }));
  };

  const getTotalVariations = (imageData) => {
    if (!imageData) return Math.floor(Math.random() * 50) + 5; // Random 5-55
    return Object.values(imageData).reduce((total, platformSizes) => {
      return total + Object.keys(platformSizes).length;
    }, 0);
  };

  // Generate dummy performance data
  const generateDummyData = (creative) => {
    const impressions = Math.floor(Math.random() * 200000) + 50000;
    const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.02)); // 2-12% CTR
    const adSpend = Math.floor(Math.random() * 2000) + 500;
    const revenue = Math.floor(adSpend * (Math.random() * 3 + 0.5)); // 0.5x-3.5x ROAS
    const roas = (revenue / adSpend).toFixed(1);
    const uplift = (Math.random() * 30 - 5).toFixed(1); // -5% to +25%
    
    let health = 'Average';
    if (roas >= 2.5) health = 'Excellent';
    else if (roas >= 1.5) health = 'Good';
    else if (roas >= 1.0) health = 'Average';
    else health = 'Poor';

    return {
      impressions,
      clicks,
      adSpend,
      revenue,
      roas,
      uplift,
      health
    };
  };

  // Table columns definition
  const columns = [
    {
      title: 'CREATIVE NAME',
      dataIndex: 'creative_title',
      key: 'creative_name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <CheckSquareOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">
              Last modified: {new Date(record.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'CREATIVE ID',
      dataIndex: 'creative_id',
      key: 'creative_id',
      render: (id) => `CRE-${id}`,
      sorter: true,
    },
    {
      title: 'PLATFORM',
      dataIndex: 'selected_platforms',
      key: 'platform',
      render: (platforms) => {
        if (!platforms || platforms.length === 0) return '-';
        const platform = platforms[0]; // Show first platform
        return (
          <Space>
            {platformIcons[platform]}
            <span>{platformNames[platform]}</span>
          </Space>
        );
      },
      sorter: true,
    },
    {
      title: 'DCO VARIATIONS',
      dataIndex: 'image_data',
      key: 'dco_variations',
      render: (imageData) => getTotalVariations(imageData),
      sorter: true,
    },
    {
      title: 'IMPRESSIONS',
      key: 'impressions',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        return dummyData.impressions.toLocaleString();
      },
      sorter: true,
    },
    {
      title: 'CLICKS',
      key: 'clicks',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        return dummyData.clicks.toLocaleString();
      },
      sorter: true,
    },
    {
      title: 'AD SPEND',
      key: 'ad_spend',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        return `$${dummyData.adSpend.toLocaleString()}`;
      },
      sorter: true,
    },
    {
      title: 'REVENUE',
      key: 'revenue',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        return `$${dummyData.revenue.toLocaleString()}`;
      },
      sorter: true,
    },
    {
      title: 'ROAS',
      key: 'roas',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        return `${dummyData.roas}x`;
      },
      sorter: true,
    },
    {
      title: 'UPLIFT',
      key: 'uplift',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        const color = dummyData.uplift >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{dummyData.uplift >= 0 ? '+' : ''}{dummyData.uplift}%</span>;
      },
      sorter: true,
    },
    {
      title: 'HEALTH',
      key: 'health',
      render: (_, record) => {
        const dummyData = generateDummyData(record);
        let color = 'default';
        switch (dummyData.health) {
          case 'Excellent': color = 'green'; break;
          case 'Good': color = 'blue'; break;
          case 'Average': color = 'orange'; break;
          case 'Poor': color = 'red'; break;
        }
        return <Tag color={color}>{dummyData.health}</Tag>;
      },
      sorter: true,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<Eye />} 
            onClick={() => window.open(`/creatives/${record.creative_id}`, '_blank')}
            title="View"
          />
          <Button 
            type="text" 
            icon={<Pencil />} 
            onClick={() => window.open(`/creatives/${record.creative_id}/edit`, '_blank')}
            title="Edit"
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'download',
                  label: 'Download',
                  onClick: () => window.open(record.creative_s3_url, '_blank')
                },
                {
                  key: 'duplicate',
                  label: 'Duplicate',
                  onClick: () => console.log('Duplicate', record.creative_id)
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  onClick: () => console.log('Delete', record.creative_id)
                }
              ]
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<Ellipsis />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className='grid grid-cols-2 justify-between gap-y-4! mt-12 mb-6'>
          <div>
              <h1 className='text-2xl font-semibold'>Asset Library</h1>
              <p>Manage and organize your creative assets</p>
          </div>
          <div className='flex justify-end'>
              <Link href='/creatives/new'>
              <button className='flex items-center bg-black py-2 text-white px-4 rounded-md text-sm gap-3'>
                  <PlusIcon />
                  Add New Creative
              </button>
              </Link>
          </div>
      </div>
      <div className='grid grid-cols-2 justify-between gap-y-4! mt-12 mb-6'>
          <div className="w-[400px] flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2">
              <SearchIcon className='w-4 h-4' />
              <Input
                placeholder='Search Creatives...'
                value={searchValue}
                onChange={handleSearchChange}
                onPressEnter={handleSearchPressEnter}
                className='border-none outline-none shadow-none'
                style={{ border: 'none', boxShadow: 'none' }}
                allowClear
              />
          </div>
          <div className='flex justify-end gap-2'>
              <div>
                  <Dropdown menu={{
                      items: [
                          {
                              label: 'All',
                              key: 'all',
                              onClick: () => handlePlatformFilterChange('all')
                          },
                          ...Object.entries(platformNames).map(([key, name]) => ({
                              label: name,
                              key: key,
                              onClick: () => handlePlatformFilterChange(key)
                          }))
                      ],
                  }}>
                      <button className='flex items-center gap-2 bg-white text-black! border border-gray-300 px-4 py-3 rounded-md text-sm gap-3'>
                          {filters.platform_filter ? platformNames[filters.platform_filter] : 'All Platforms'} <ChevronDownIcon className='w-4 h-4' />
                      </button>
                  </Dropdown>
              </div>
              <div>
                  <Dropdown menu={{
                      items: [
                          {
                              label: 'All',
                              key: 'all',
                          },
                      ],
                  }}>
                      <button className='flex items-center gap-2 bg-white text-black! border border-gray-300 px-4 py-3 rounded-md text-sm gap-3'>
                          All Status <ChevronDownIcon className='w-4 h-4' />
                      </button>
                  </Dropdown>
              </div>
              <div>
                  <Dropdown menu={{
                      items: [
                          {
                              label: 'All',
                              key: 'all',
                          },
                      ],
                  }}>
                      <button className='flex items-center gap-2 bg-white text-black! border border-gray-300 px-4 py-3 rounded-md text-sm gap-3'>
                          <FilterIcon className='w-4 h-4 text-black!' />
                      </button>
                  </Dropdown>
              </div>
              <div className='flex rounded-md!'>
                  <span className='flex items-center gap-2 rounded-l-md! bg-black text-white! border border-gray-300 px-2 py-3 text-sm gap-3'>
                      <List className='w-4 h-4 text-white!' />
                  </span>
                  <span className='flex items-center gap-2 rounded-r-md! bg-white text-white! border border-gray-300 px-2 py-3 text-sm gap-3'>
                      <Grid className='w-4 h-4 text-black!' />
                  </span>
              </div>
          </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={creatives}
          rowKey="creative_id"
          pagination={false}
          loading={loading}
          scroll={{ x: 1200 }}
          className="ant-table-custom"
          onRow={(record) => ({
            onClick: () => window.location.href = `/creatives/${record.creative_id}`,
            style: { cursor: 'pointer' }
          })}
        />
      </div>

      {/* Enhanced Pagination with Page Size Control */}
      {pagination.total > 0 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {filters.offset + 1} to {Math.min(filters.offset + filters.limit, pagination.total)} of {pagination.total} creatives
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={filters.limit}
                onChange={handlePageSizeChange}
                options={[
                  { value: 10, label: '10 per page' },
                  { value: 20, label: '20 per page' },
                  { value: 50, label: '50 per page' },
                  { value: 100, label: '100 per page' }
                ]}
                style={{ width: 120 }}
                size="small"
              />
            </div>
          </div>
          <Pagination
            current={Math.floor(filters.offset / filters.limit) + 1}
            total={pagination.total}
            pageSize={filters.limit}
            showSizeChanger={false} // We handle this separately above
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            onChange={handlePageChange}
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;