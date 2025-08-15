"use client";
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Typography, Pagination, Select, Spin, Empty, Button, Dropdown } from 'antd';
import { FacebookIcon, InstagramIcon } from 'lucide-react';
import { EyeOutlined, EditOutlined, MoreOutlined, CheckOutlined } from '@ant-design/icons';
import { Platforms } from '../util/platformUtil';
import api from '@/conf/api';

const { Title, Text } = Typography;
const { Option } = Select;

const CreativesList = () => {
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
        offset: 0
    });

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
                ...(filters.platform_filter && { platform_filter: filters.platform_filter })
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

    useEffect(() => {
        fetchCreatives();
    }, [filters]);

    const handlePageChange = (page) => {
        const newOffset = (page - 1) * filters.limit;
        setFilters(prev => ({
            ...prev,
            offset: newOffset
        }));
    };

    const handlePlatformFilterChange = (value) => {
        setFilters(prev => ({
            ...prev,
            platform_filter: value,
            offset: 0 // Reset to first page when filter changes
        }));
    };

    const handleLimitChange = (value) => {
        setFilters(prev => ({
            ...prev,
            limit: value,
            offset: 0 // Reset to first page when limit changes
        }));
    };

    const getTotalVariations = (imageData) => {
        if (!imageData) return Math.floor(Math.random() * 50) + 5; // Random 5-55
        return Object.values(imageData).reduce((total, platformSizes) => {
            return total + Object.keys(platformSizes).length;
        }, 0);
    };

    const getPlatformCount = (selectedPlatforms) => {
        return selectedPlatforms?.length || 0;
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

    if (loading && creatives.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    // Table columns definition
    const columns = [
        {
            title: 'CREATIVE NAME',
            dataIndex: 'creative_title',
            key: 'creative_name',
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    <CheckOutlined className="text-gray-400" />
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
                        icon={<EyeOutlined />} 
                        onClick={() => window.open(`/creatives/${record.creative_id}`, '_blank')}
                        title="View"
                    />
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
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
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Title level={2}>All Creatives</Title>
                    <Text type="secondary">Manage and view all your created creatives</Text>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <Text strong className="block mb-2">Platform Filter</Text>
                            <Select
                                placeholder="All Platforms"
                                style={{ width: 200 }}
                                value={filters.platform_filter}
                                onChange={handlePlatformFilterChange}
                                allowClear
                            >
                                {Object.entries(platformNames).map(([key, name]) => (
                                    <Option key={key} value={key}>
                                        <Space>
                                            {platformIcons[key]}
                                            {name}
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Text strong className="block mb-2">Items per page</Text>
                            <Select
                                value={filters.limit}
                                onChange={handleLimitChange}
                                style={{ width: 120 }}
                            >
                                <Option value={5}>5</Option>
                                <Option value={10}>10</Option>
                                <Option value={20}>20</Option>
                                <Option value={50}>50</Option>
                            </Select>
                        </div>
                        <div className="ml-auto">
                            <Text type="secondary">
                                Showing {creatives.length} of {pagination.total} creatives
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Creatives Table */}
                {creatives.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12">
                        <Empty
                            description="No creatives found"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm">
                        <Table
                            columns={columns}
                            dataSource={creatives}
                            rowKey="creative_id"
                            pagination={false}
                            loading={loading}
                            scroll={{ x: 1200 }}
                            className="ant-table-custom"
                        />
                    </div>
                )}

                {/* Pagination */}
                {pagination.total > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            current={Math.floor(pagination.offset / pagination.limit) + 1}
                            total={pagination.total}
                            pageSize={pagination.limit}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) => 
                                `${range[0]}-${range[1]} of ${total} items`
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreativesList;
