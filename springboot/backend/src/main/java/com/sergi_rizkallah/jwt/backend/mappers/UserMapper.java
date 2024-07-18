package com.sergi_rizkallah.jwt.backend.mappers;

import com.sergi_rizkallah.jwt.backend.dto.SignUpDto;
import com.sergi_rizkallah.jwt.backend.dto.UserDto;
import com.sergi_rizkallah.jwt.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);

}
