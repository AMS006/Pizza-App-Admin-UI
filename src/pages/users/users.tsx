import { Breadcrumb } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined } from '@ant-design/icons';

const UsersPage = () => {
    return (
        <div>
            <Breadcrumb separator={<RightOutlined />}>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Users</Breadcrumb.Item>
            </Breadcrumb>
        </div>
    )
}

export default UsersPage
